const express = require("express")
const router = express.Router();
const puppeteer = require('puppeteer')
const { db } = require("../database/mongodb")
const path = require('path');
const moment = require('moment');
const fs = require('fs');
require("dotenv").config()

// vibe top 100 정보 DB 저장
router.get('/vibe', async (req, res) => {
    console.log('vibe start')
    const regDate = moment().format('YYYYMMDD_HH')
    try {
        const database = await db()
        const browser = await puppeteer.launch({ headless: 'new' })
        const page = await browser.newPage() // 브라우저 실행
        await page.goto(`${process.env.VIBEURL}`) // 해당 페이지로 이동

        // evaluate() 함수를 이용해 html 선택자를 선택하고 반복문으로 내용을 빈배열에 추가
        const reactHistory = await page.evaluate((regDate) => {
            let scrappedData = []
            const tracklist = document.querySelectorAll("#content > div.track_section > div:nth-child(2) > div > table > tbody > tr")

            Array.from(tracklist).forEach((element, i) => {
                scrappedData.push({
                    rank: i + 1,
                    title: element.querySelector("td.song > div.title_badge_wrap > span > a").textContent,
                    artist: element.querySelector("td.artist > span > span > span > a>span").textContent,
                    regDate: regDate
                })
            })
            
            return scrappedData
        }, regDate)
        database.collection("vibe").insertMany(reactHistory)
        
        await page.close()
        await browser.close()
        return res.status(200).json({ code: 200, message: reactHistory })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ code: 500, message: "error" })
    }
})

// 네이버에 검색 후 화면 저장
router.get('/naver', async (req, res) => {
    let searchKeyword = req.query.keyword
    console.log('naver search : ' + searchKeyword)
    try {
        const browser = await puppeteer.launch({ headless: 'false' })
        const page = await browser.newPage()
        await page.goto(`${process.env.NAVERURL}`, { waitUntil: 'networkidle2', timeout: 30000 })
        await page.waitForSelector('input[name=query]')
        await page.type('input[name=query]', searchKeyword)
        await page.waitForSelector('.btn_search')
        await Promise.all([
            // 결과 페이지 로딩 기다리기
            page.waitForNavigation({ timeout: 3000 }),
            page.click('.btn_search'),
        ])

        // 해당 경로에 스크린 샷 저장
        const screenshotDirPath = path.join(__dirname, '../screenshot')
        if (!fs.existsSync(screenshotDirPath)) {
            fs.mkdirSync(screenshotDirPath)
        }
        const screenshotFilePath = path.join(screenshotDirPath, `${searchKeyword}_${moment().format('YYYYMMDD_HHmmss')}.png`)
        await page.screenshot({path: screenshotFilePath, fullPage:true})

        browser.close()

        return res.status(200).json({ code: 200, message: screenshotFilePath })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ code: 500, message: "error" })
    }
})

module.exports = router