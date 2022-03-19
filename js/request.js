const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require('fs')
// const db_config = require("./sql.js");
// const conn = db_config.init()
// const standartTime = "2022-03-01 00:00:00"
// let stop = false



async function loop_board(page) {
  // cheerio를 통해 xml 파일 처리
  const mainboard = await page.content()
  const $ = cheerio.load(mainboard)
  const lists = $('.list-unstyled > li > h4 > a:nth-child(1)').text();
  const text = lists;
  fs.writeFileSync("target.txt", '\ufeff' + text, {encoding: 'utf8'});

}


// 게시판에서 가져온 id로 개별 게시물 조회
const getArticleId = async(lists, $, page) => {
  for (let i = 0; i < lists.length; i++) {
    const articleId = $(lists[i]).attr('id');
    await page.goto(`https://api.everytime.kr/find/board/comment/list?id=${articleId}&limit_num=-1&articleInfo=true`)
    // 게시물 컨텐츠 로드 및 저장
    const article = await page.content()
    const _ = cheerio.load(article, {xmlMode: true})
    const res = `${_('#webkit-xml-viewer-source-xml > response > article').attr('title')} ${_('#webkit-xml-viewer-source-xml > response > article').attr('text')}`;
    const content = res.replace(/<br \/>/g, " ")
    const time = _('#webkit-xml-viewer-source-xml > response > article').attr('created_at');
    if (standartTime > time) {
      stop = true
      break;
    }

    console.log(i + " article load")
    saveDB(articleId, time, content)
    await page.waitForTimeout(400)
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
    // api 요청
    await page.goto("https://openreview.net/group?id=ICLR.cc/2021/Conference#poster-presentations")
    console.log("Go mian page")
    await page.waitForTimeout(30000)

    // 게시판에서 가져온 id로 개별 게시물 조회
    await loop_board(page)


  } catch(error){
    console.log("Error:", error)
  }
})();