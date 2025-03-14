'use client';

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

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export default function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  // 根据天气代码获取图标
  const getWeatherIcon = (code: number) => {
    // 简单的天气代码到图标映射
    if (code === 0) return '☀️'; // 晴朗
    if (code === 1) return '🌤️'; // 大部晴朗
    if (code === 2) return '⛅'; // 局部多云
    if (code === 3) return '☁️'; // 多云
    if (code >= 45 && code <= 48) return '🌫️'; // 雾
    if (code >= 51 && code <= 57) return '🌧️'; // 毛毛雨/冻雨
    if (code >= 61 && code <= 67) return '🌧️'; // 雨
    if (code >= 71 && code <= 77) return '❄️'; // 雪
    if (code >= 80 && code <= 82) return '🌦️'; // 阵雨
    if (code >= 85 && code <= 86) return '🌨️'; // 阵雪
    if (code >= 95) return '⛈️'; // 雷暴
    return '🌡️'; // 默认
  };

  // 获取天气背景色
  const getWeatherBackground = (code: number) => {
    if (code === 0) return 'from-yellow-400 to-orange-300'; // 晴朗
    if (code >= 1 && code <= 2) return 'from-blue-300 to-yellow-200'; // 部分多云
    if (code === 3) return 'from-blue-200 to-gray-200'; // 多云
    if (code >= 45 && code <= 48) return 'from-gray-300 to-gray-200'; // 雾
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'from-blue-400 to-blue-300'; // 雨
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'from-blue-100 to-gray-100'; // 雪
    if (code >= 95) return 'from-gray-600 to-blue-500'; // 雷暴
    return 'from-primary-200 to-primary-100'; // 默认
  };

  const weatherIcon = getWeatherIcon(weatherData.weatherCode);
  const bgGradient = getWeatherBackground(weatherData.weatherCode);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 主卡片 */}
      <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl shadow-card p-6 mb-4 dark:text-white`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{weatherData.city}</h2>
          <div className="text-6xl">{weatherIcon}</div>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="text-7xl font-bold mb-2">{Math.round(weatherData.temperature)}°</div>
          <p className="text-xl font-medium">{weatherData.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/30 dark:bg-black/20 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-sm opacity-70">体感温度</p>
            <p className="text-xl font-semibold">{Math.round(weatherData.feelsLike)}°C</p>
          </div>
          <div className="bg-white/30 dark:bg-black/20 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-sm opacity-70">降水量</p>
            <p className="text-xl font-semibold">{weatherData.precipitation} mm</p>
          </div>
        </div>
      </div>
      
      {/* 详细信息卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-primary-800 p-4 rounded-2xl shadow-card">
          <div className="flex items-center mb-2 text-primary-600 dark:text-primary-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">湿度</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{weatherData.humidity}%</p>
        </div>
        
        <div className="bg-white dark:bg-primary-800 p-4 rounded-2xl shadow-card">
          <div className="flex items-center mb-2 text-primary-600 dark:text-primary-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">风速</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{weatherData.windSpeed} km/h</p>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-primary-500 dark:text-primary-400">
        <p>数据来源: Open-Meteo API</p>
        <p className="mt-1">更新时间: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
} 