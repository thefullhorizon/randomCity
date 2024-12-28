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

// DOM 元素
const selectBtn = document.getElementById('selectBtn');
const cityImage = document.getElementById('cityImage');
const cityName = document.getElementById('cityName');
const menuBtn = document.getElementById('menuBtn');
const cityList = document.getElementById('cityList');

let isRolling = false;
let rollInterval;

// 随机选择城市
function getRandomCity() {
    const index = Math.floor(Math.random() * cities.length);
    return cities[index];
}

// 更新图片函数
function updateCityImages(city) {
    if (isRolling && city === defaultCity) {
        city = getRandomCity();
    }
    
    const tempImg = new Image();
    
    const updateDOM = () => {
        if (isRolling && city === defaultCity) {
            city = getRandomCity();
        }
        cityImage.src = city.image;
        cityName.textContent = city.name;
    };

    tempImg.onload = updateDOM;
    tempImg.onerror = () => {
        if (isRolling) {
            const newCity = getRandomCity();
            updateCityImages(newCity);
        } else {
            updateDOM();
        }
    };
    
    tempImg.src = city.image;
    setTimeout(updateDOM, 100);
}

// 开始滚动函数
function startRolling() {
    if (isRolling) return;
    
    isRolling = true;
    selectBtn.disabled = true;
    selectBtn.textContent = '选择中...';
    
    cities.forEach(city => {
        const img = new Image();
        img.src = city.image;
    });
    
    const roll = async () => {
        const randomCity = getRandomCity();
        await new Promise(resolve => {
            updateCityImages(randomCity);
            setTimeout(resolve, 100);
        });
    };
    
    roll();
    
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

// 菜单按钮点击事件
menuBtn.addEventListener('click', () => {
    cityList.classList.toggle('open');
}); 

document.addEventListener('DOMContentLoaded', () => {
    const cityList = document.getElementById('cityList');

    // 监听窗口大小变化，重置城市列表样式
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // 如果是大屏幕，确保城市列表在右侧正常显示
            cityList.classList.remove('open');
            cityList.style.transform = ''; // 恢复默认样式
        }
    });
});
