'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';

// 定义城市类型
interface City {
  name: string;
  latitude: number;
  longitude: number;
}

// 定义天气数据类型
interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  precipitation: number;
  weatherCode: number;
}

// 预定义一些城市及其坐标
const cities: City[] = [
  { name: '北京', latitude: 39.9042, longitude: 116.4074 },
  { name: '上海', latitude: 31.2304, longitude: 121.4737 },
  { name: '广州', latitude: 23.1291, longitude: 113.2644 },
  { name: '深圳', latitude: 22.5431, longitude: 114.0579 },
  { name: '成都', latitude: 30.5728, longitude: 104.0668 },
  { name: '杭州', latitude: 30.2741, longitude: 120.1551 },
  { name: '纽约', latitude: 40.7128, longitude: -74.0060 },
  { name: '伦敦', latitude: 51.5074, longitude: -0.1278 },
  { name: '东京', latitude: 35.6762, longitude: 139.6503 },
  { name: '巴黎', latitude: 48.8566, longitude: 2.3522 },
  { name: '悉尼', latitude: -33.8688, longitude: 151.2093 },
  { name: '开罗', latitude: 30.0444, longitude: 31.2357 },
  { name: '里约热内卢', latitude: -22.9068, longitude: -43.1729 },
  { name: '莫斯科', latitude: 55.7558, longitude: 37.6173 },
  { name: '开普敦', latitude: -33.9249, longitude: 18.4241 }
];

// 获取随机城市
const getRandomCity = (): City => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(getRandomCity());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchWeather = async (city: City) => {
    setLoading(true);
    setError('');
    try {
      // 使用Open-Meteo API
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
      );
      
      // 处理API返回的数据
      const current = response.data.current;
      
      // 根据天气代码获取描述
      const weatherDescription = getWeatherDescription(current.weather_code);
      
      // 构建我们自己的天气数据对象
      const formattedData: WeatherData = {
        city: city.name,
        temperature: current.temperature_2m,
        description: weatherDescription,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        feelsLike: current.apparent_temperature,
        precipitation: current.precipitation,
        weatherCode: current.weather_code
      };
      
      setWeatherData(formattedData);
    } catch (err) {
      setError('获取天气数据失败，请稍后再试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 根据WMO天气代码获取描述
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: '晴朗',
      1: '大部晴朗',
      2: '局部多云',
      3: '多云',
      45: '雾',
      48: '沉积雾',
      51: '小毛毛雨',
      53: '中毛毛雨',
      55: '大毛毛雨',
      56: '小冻雨',
      57: '大冻雨',
      61: '小雨',
      63: '中雨',
      65: '大雨',
      66: '小冻雨',
      67: '大冻雨',
      71: '小雪',
      73: '中雪',
      75: '大雪',
      77: '雪粒',
      80: '小阵雨',
      81: '中阵雨',
      82: '大阵雨',
      85: '小阵雪',
      86: '大阵雪',
      95: '雷暴',
      96: '雷暴伴有小冰雹',
      99: '雷暴伴有大冰雹'
    };
    
    return weatherCodes[code] || '未知天气';
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, []);

  const handleSearch = (cityName: string) => {
    const foundCity = cities.find(city => city.name === cityName);
    if (foundCity) {
      setSelectedCity(foundCity);
      fetchWeather(foundCity);
    } else {
      setError(`未找到城市: ${cityName}`);
    }
  };

  const handleRandomCity = () => {
    const randomCity = getRandomCity();
    setSelectedCity(randomCity);
    fetchWeather(randomCity);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary-800 dark:text-primary-200 tracking-tight">
          全球天气<span className="text-primary-600">预报</span>
        </h1>
        
        <div className="flex flex-col items-center mb-10 animate-slide-up">
          <SearchBar onSearch={handleSearch} cities={cities.map(city => city.name)} />
          
          <button 
            onClick={handleRandomCity}
            className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-button font-medium"
          >
            随机城市 🔄
          </button>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8 animate-fade-in">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        {!loading && !error && weatherData && (
          <div className="animate-slide-up">
            <WeatherDisplay weatherData={weatherData} />
          </div>
        )}
        
        <footer className="mt-16 text-center text-primary-600 dark:text-primary-400 text-sm">
          <p>使用 Open-Meteo API 提供的实时天气数据</p>
          <p className="mt-2">© {new Date().getFullYear()} 全球天气预报</p>
        </footer>
      </div>
    </main>
  );
} 