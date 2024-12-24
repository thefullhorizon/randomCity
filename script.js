// 城市数据，简化图片格式
const cities = [
    { 
        name: '北京', 
        image: 'images/beijing.jpg'
    },
    { 
        name: '上海', 
        image: 'images/shanghai.jpg'
    },
    { 
        name: '广州', 
        image: 'images/guangzhou.jpg'
    },
    { 
        name: '深圳', 
        image: 'images/shenzhen.jpg'
    },
    { 
        name: '杭州', 
        image: 'images/hangzhou.jpg'
    },
    { 
        name: '成都', 
        image: 'images/chengdu.jpg'
    },
    { 
        name: '南京', 
        image: 'images/nanjing.jpg'
    },
    { 
        name: '重庆', 
        image: 'images/chongqing.jpg'
    },
    { 
        name: '武汉', 
        image: 'images/wuhan.jpg'
    },
    { 
        name: '青岛', 
        image: 'images/qingdao.jpg'
    },
    { 
        name: '郑州', 
        image: 'images/zhengzhou.jpg'
    }
];

// 默认城市数据
const defaultCity = {
    name: '点击开始选择',
    image: 'images/default.jpg'
};

// DOM 元素，移除不需要的元素引用
const selectBtn = document.getElementById('selectBtn');
const cityImage = document.getElementById('cityImage');
const cityName = document.getElementById('cityName');

let isRolling = false;
let rollInterval;

// 随机选择城市
function getRandomCity() {
    const index = Math.floor(Math.random() * cities.length);
    return cities[index];
}

// 更新图片函数，简化为只处理 jpg
function updateCityImages(city) {
    // 如果已经开始过选择，且传入的是默认城市，则随机选择一个城市
    if (isRolling && city === defaultCity) {
        city = getRandomCity();
    }
    
    // 创建临时图片对象来预加载
    const tempImg = new Image();
    
    // 更新DOM的函数
    const updateDOM = () => {
        // 再次确认不会显示默认城市
        if (isRolling && city === defaultCity) {
            city = getRandomCity();
        }
        cityImage.src = city.image;
        cityName.textContent = city.name;
    };

    // 处理图片加载
    tempImg.onload = updateDOM;
    tempImg.onerror = () => {
        // 如果图片加载失败，尝试加载另一个城市的图片
        if (isRolling) {
            const newCity = getRandomCity();
            updateCityImages(newCity);
        } else {
            updateDOM();
        }
    };
    
    // 开始加载图片
    tempImg.src = city.image;
    
    // 设置超时，防止图片加载时间过长
    setTimeout(updateDOM, 100);
}

// 开始滚动函数
function startRolling() {
    if (isRolling) return;
    
    isRolling = true;
    selectBtn.disabled = true;
    selectBtn.textContent = '选择中...';
    
    // 预加载所有城市图片
    cities.forEach(city => {
        const img = new Image();
        img.src = city.image;
    });
    
    // 使用 Promise 来处理每次更新
    const roll = async () => {
        const randomCity = getRandomCity();
        await new Promise(resolve => {
            updateCityImages(randomCity);
            setTimeout(resolve, 100);
        });
    };
    
    // 立即开始第一次滚动
    roll();
    
    // 设置一个随机的滚动次数（10-15次）
    const totalRolls = 10 + Math.floor(Math.random() * 6);
    let currentRoll = 0;
    
    rollInterval = setInterval(() => {
        currentRoll++;
        if (currentRoll >= totalRolls) {
            stopRolling();
        } else {
            roll();
        }
    }, 200);
}

// 停止滚动函数
function stopRolling() {
    clearInterval(rollInterval);
    isRolling = false;
    selectBtn.disabled = false;
    selectBtn.textContent = '开始选择';
    
    // 最终选择
    const finalCity = getRandomCity();
    updateCityImages(finalCity);
}

// 绑定点击事件
selectBtn.addEventListener('click', startRolling);

// 图片加载失败处理
cityImage.addEventListener('error', function() {
    if (isRolling) {
        const newCity = getRandomCity();
        updateCityImages(newCity);
    } else if (!this.src.includes('default')) {
        const newCity = getRandomCity();
        updateCityImages(newCity);
    } else {
        updateCityImages(defaultCity);
    }
});

// 页面加载时显示默认状态
document.addEventListener('DOMContentLoaded', () => {
    updateCityImages(defaultCity);
}); 