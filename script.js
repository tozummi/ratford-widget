const STAY_DATES = [
  { date: "2026-08-17", day: "Mon" },
  { date: "2026-08-18", day: "Tue" },
  { date: "2026-08-19", day: "Wed" },
  { date: "2026-08-20", day: "Thu" },
  { date: "2026-08-21", day: "Fri" }
];

/*
  Ratford Bridge Farmhouse / SN11 9JX
*/
const LATITUDE = 51.445518;
const LONGITUDE = -2.027169;

const forecastGrid = document.getElementById("forecast-grid");

function createWeatherIcon(type) {
  const strokeSettings = `
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
  `;

  const icons = {
    sun: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="20"
          cy="20"
          r="6.5"
          ${strokeSettings}
        ></circle>

        <path
          d="
            M20 5v5
            M20 30v5
            M5 20h5
            M30 20h5
            M9.4 9.4l3.5 3.5
            M27.1 27.1l3.5 3.5
            M30.6 9.4l-3.5 3.5
            M12.9 27.1l-3.5 3.5
          "
          ${strokeSettings}
        ></path>
      </svg>
    `,

    partly: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="14"
          cy="13"
          r="5"
          ${strokeSettings}
        ></circle>

        <path
          d="
            M14 4v3
            M5 13h3
            M7.5 6.5l2.2 2.2
            M20.5 6.5l-2.2 2.2
          "
          ${strokeSettings}
        ></path>

        <path
          d="
            M11 29h18
            a5.5 5.5 0 0 0 .3-11
            a8.5 8.5 0 0 0 -15.9 2.2
            A4.5 4.5 0 0 0 11 29Z
          "
          ${strokeSettings}
        ></path>
      </svg>
    `,

    cloud: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="
            M9 29h21
            a6 6 0 0 0 .3-12
            a9.8 9.8 0 0 0 -18.6 2.7
            A5 5 0 0 0 9 29Z
          "
          ${strokeSettings}
        ></path>
      </svg>
    `,

    rain: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="
            M9 24h21
            a6 6 0 0 0 .3-12
            a9.8 9.8 0 0 0 -18.6 2.7
            A5 5 0 0 0 9 24Z
          "
          ${strokeSettings}
        ></path>

        <path
          d="
            M13 29l-2 4
            M21 29l-2 4
            M29 29l-2 4
          "
          ${strokeSettings}
        ></path>
      </svg>
    `
  };

  return icons[type] || icons.cloud;
}

function getWeatherDetails(code) {
  if (code === 0) {
    return {
      condition: "Clear and sunny",
      icon: "sun"
    };
  }

  if (code === 1 || code === 2) {
    return {
      condition: "Partly cloudy",
      icon: "partly"
    };
  }

  if (code === 3 || code === 45 || code === 48) {
    return {
      condition: "Cloudy",
      icon: "cloud"
    };
  }

  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  ) {
    return {
      condition: "Rain likely",
      icon: "rain"
    };
  }

  if (code >= 71 && code <= 77) {
    return {
      condition: "Snow",
      icon: "cloud"
    };
  }

  return {
    condition: "Mixed weather",
    icon: "partly"
  };
}

function createPendingForecast() {
  return STAY_DATES.map(item => ({
    day: item.day,
    date: item.date,
    high: null,
    low: null,
    condition: "Forecast pending",
    icon: "cloud"
  }));
}

function renderForecast(forecast) {
  forecastGrid.innerHTML = forecast
    .map(day => {
      const high =
        day.high === null || day.high === undefined
          ? "–"
          : `${Math.round(day.high)}°`;

      const low =
        day.low === null || day.low === undefined
          ? "–"
          : `${Math.round(day.low)}°`;

      return `
        <article
          class="forecast-day"
          title="${day.condition}"
        >
          <div class="day-name">
            ${day.day}
          </div>

          <div
            class="weather-icon"
            aria-label="${day.condition}"
          >
            ${createWeatherIcon(day.icon)}
          </div>

          <div class="temperatures">
            <span class="temperature-high">
              ${high}
            </span>

            <span class="temperature-low">
              ${low}
            </span>
          </div>

          <div class="condition">
            ${day.condition}
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadForecast() {
  renderForecast(createPendingForecast());

  const apiUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LATITUDE}` +
    `&longitude=${LONGITUDE}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=celsius` +
    `&timezone=Europe%2FLondon` +
    `&forecast_days=16`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = await response.json();

    const availableForecast = new Map();

    data.daily.time.forEach((date, index) => {
      const weather = getWeatherDetails(
        data.daily.weather_code[index]
      );

      availableForecast.set(date, {
        high: data.daily.temperature_2m_max[index],
        low: data.daily.temperature_2m_min[index],
        condition: weather.condition,
        icon: weather.icon
      });
    });

    const forecast = STAY_DATES.map(item => {
      const result = availableForecast.get(item.date);

      if (!result) {
        return {
          day: item.day,
          date: item.date,
          high: null,
          low: null,
          condition: "Forecast pending",
          icon: "cloud"
        };
      }

      return {
        day: item.day,
        date: item.date,
        ...result
      };
    });

    renderForecast(forecast);
  } catch (error) {
    console.error("Could not load forecast:", error);

    renderForecast(createPendingForecast());
  }
}

loadForecast();
