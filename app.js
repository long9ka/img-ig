const url = 'https://www.instagram.com/realmadrid/';
const destImg = './image';

const puppeteer = require('puppeteer');
const fs = require('fs');
const downloader = require('image-downloader');

async function timeOut(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getImgFromSrc(imagesSrc) {
  const imgFromArr = imagesSrc.split(',');
  return imgFromArr[imgFromArr.length - 1].split(' ')[0];
}

getImgFromUrl = async (url) => {
  const brower = await puppeteer.launch();
  const page = await brower.newPage();
  await page.goto(url);
  await timeOut(10000); // waiting for loading page
  const imagesSrc = await page.evaluate(() =>
    Array.from(document.querySelectorAll('article img')).map(img => img.getAttribute('srcset'))
  )
  brower.close();
  return imagesSrc.map(imagesrc => getImgFromSrc(imagesrc));   
}

async function main() {
  console.log('Dowloading ...');
  const images = await getImgFromUrl(url);
  // Create folder
  if (!fs.existsSync(destImg)) {
    fs.mkdirSync(destImg)
  }

  images.map(image => {
    downloader({
      url: image,
      dest: destImg
    })
  })
}

main()
