const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const db_config = require("./sql.js");
const conn = db_config.init()


function saveDB(articleId, time, content) {
  let param = [articleId, time, content]
  let sql = `insert into article(id, time, content) values(?, ?, ?)`;
  conn.query(sql,param, function(error, rows, fields) {
    if(error) console.log('query failed: ' + error)
  })
  console.log("save db")
}


// 게시판에서 가져온 id로 개별 게시물 조회
const getArticleId = async(lists, $, page) => {
  for (let i = 0; i < lists.length; i++) {
    const articleId = $(lists[i]).attr('id');
    await page.goto(`https://api.everytime.kr/find/board/comment/list?id=${articleId}&limit_num=-1&articleInfo=true`)
    // 게시물 컨텐츠 로드 및 저장
    const article = await page.content()
    const _ = cheerio.load(article, {xmlMode: true})
    const content = `${_('#webkit-xml-viewer-source-xml > response > article').attr('title')} ${_('#webkit-xml-viewer-source-xml > response > article').attr('text')}`;
    // const text = ;
    const time = _('#webkit-xml-viewer-source-xml > response > article').attr('created_at');
    console.log(i + " article load")
    saveDB(articleId, time, content)
    await page.waitForTimeout(1000)
  }
}
// 로그인 
const login = async(page) => {
  const id = "che0618"
  const pw = "hongsuck36"
  await page.goto('https://everytime.kr/login');
  await page.evaluate((id, pw) => {
    document.querySelector('.input input[name=userid]').value = id
    document.querySelector('.input input[name=password]').value = pw
  }, id, pw);
  // 로그인 버튼 클릭
  await page.click('.submit');
  await page.waitForTimeout(2000)
  console.log("Successfully login")
}


(async() => {
  try{
    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: false
    });
  
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
  
    // 페이지의 크기를 설정한다.
    // await page.setViewport({
    //   width: 1366,
    //   height: 768
    // });
  
    // 로그인
    await login(page)

    // api 요청
    await page.goto("https://api.everytime.kr/find/board/article/list?id=370448&limit_num=2&start_num=1")
    console.log("Go mian page after Login")
    await page.waitForTimeout(2000)

    // cheerio를 통해 xml 파일 처리
    const mainboard = await page.content()
    const $ = cheerio.load(mainboard, {xmlMode: true})
    const lists = $('#webkit-xml-viewer-source-xml > response > article');
    console.log("get board xml")
    // 게시판에서 가져온 id로 개별 게시물 조회
    await getArticleId(lists, $, page)


  } catch(error){
    console.log("Error:", error)
  }
})();



// 탑틱 모델링


// 주제를 구체화