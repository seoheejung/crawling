# puppeteer로 크롤링 & 매크로 연습

### 📌 과정 (naver vibe TOP 100 전체 DB 저장)
1. naver vibe TOP 100 접근하기
2. evaluate() 함수를 이용해 html 선택자를 선택하기
3. 선택자에 있는 내용 DB에 저장하기
4. DB에 저장한 내용 반환하기

### 📌 과정 (naver 검색 화면 저장)
1. 사용자로부터 검색어 입력받기
2. 네이버에 대신 접근해서 검색하기
3. 검색된 전체 화면 png 파일로 저장하기
4. png 파일 path 반환하기

#### 💡 프로젝트 구조
```
- database
  - mondodb.js # mongoDB 설정 JS
- routes
  - puppeteer.js # puppeteer를 사용한 라우터 JS
```

#### 💡 mongodb 구조
```
DB NAME : crawling
collection : vibe
```

#### 💡 서버 실행
```
npm start
```

#### ✨사용 URL 
http://localhost:3000/naver?keyword=키워드   
http://localhost:3000/vibe