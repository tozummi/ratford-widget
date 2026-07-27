const STAY = {
  start: "2026-08-17",
  end: "2026-08-21",
  latitude: 51.444,
  longitude: -2.014,
  timezone: "Europe/London"
};

const STAY_DATES = [
  "2026-08-17",
  "2026-08-18",
  "2026-08-19",
  "2026-08-20",
  "2026-08-21"
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const forecastGrid = document.getElementById("forecast-grid");
const weatherStatus = document.getElementById("weather-status");
const countdownNumber = document.getElementById("countdown-number");
const countdownLabel = document.getElementById("countdown-label");
const propertyPhoto = document.querySelector(".property-photo");

function updateCountdown() {
  const now = new Date();
  const start = new Date(`${STAY.start}T15:00:00+01:00`);
  const end = new Date(`${STAY.end}T10:00:00+01:00`);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  if (now < start) {
    const days = Math.max(1, Math.ceil((start - now) / millisecondsPerDay));
    countdownNumber.textContent = days;
    countdownLabel.textContent = days === 1 ? "day to go" : "days to go";
    return;
  }

  if (now <= end) {
    countdownNumber.textContent = "Here";
    countdownLabel.textContent = "the stay is underway";
    return;
  }

  countdownNumber.textContent = "Done";
  countdownLabel.textContent = "until next time";
}

function iconSvg(type) {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"';

  const icons = {
    clear: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="6.5" ${common}/>
        <path d="M20 5v5M20 30v5M5 20h5M30 20h5M9.4 9.4l3.5 3.5M27.1 27.1l3.5 3.5M30.6 9.4l-3.5 3.5M12.9 27.1l-3.5 3.5" ${common}/>
      </svg>`,
    partly: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="15" cy="14" r="5.5" ${common}/>
        <path d="M15 4.5v3M6.5 14h3M8.9 7.9l2.1 2.1M21.1 7.9L19 10" ${common}/>
        <path d="M12 29h17a5.5 5.5 0 0 0 .3-11 8.5 8.5 0 0 0-15.9 2.2A4.5 4.5 0 0 0 12 29Z" ${common}/>
      </svg>`,
    cloud: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 29h21a6 6 0 0 0 .3-12 9.8 9.8 0 0 0-18.6 2.7A5 5 0 0 0 9 29Z" ${common}/>
      </svg>`,
    fog: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 23h22M6 28h23M11 33h20" ${common}/>
        <path d="M10 18h19a5 5 0 0 0 .2-10 8.3 8.3 0 0 0-15.7 2.2A4.2 4.2 0 0 0 10 18Z" ${common}/>
      </svg>`,
    rain: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 24h21a6 6 0 0 0 .3-12 9.8 9.8 0 0 0-18.6 2.7A5 5 0 0 0 9 24Z" ${common}/>
        <path d="M13 29l-2 4M21 29l-2 4M29 29l-2 4" ${common}/>
      </svg>`,
    shower: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 23h21a6 6 0 0 0 .3-12 9.8 9.8 0 0 0-18.6 2.7A5 5 0 0 0 9 23Z" ${common}/>
        <path d="M13 28l-2 4M22 27l-2.5 5M30 28l-2 4" ${common}/>
      </svg>`,
    snow: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 22h21a6 6 0 0 0 .3-12 9.8 9.8 0 0 0-18.6 2.7A5 5 0 0 0 9 22Z" ${common}/>
        <path d="M13 29h.1M21 32h.1M29 29h.1" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    storm: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 22h21a6 6 0 0 0 .3-12 9.8 9.8 0 0 0-18.6 2.7A5 5 0 0 0 9 22Z" ${common}/>
        <path d="M22 25l-4 6h4l-3 5" ${common}/>
      </svg>`,
    waiting: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="12" ${common} opacity=".45"/>
        <path d="M20 12v8l5 3" ${common}/>
      </svg>`
  };

  return icons[type] || icons.waiting;
}

function decodeWeather(code) {
  if (code === 0) return { type: "clear", label: "Clear" };
  if ([1, 2].includes(code)) return { type: "partly", label: "Partly cloudy" };
  if (code === 3) return { type: "cloud", label: "Cloudy" };
  if ([45, 48].includes(code)) return { type: "fog", label: "Fog" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
    return { type: "rain", label: "Rain" };
  }
  if ([80, 81, 82].includes(code)) return { type: "shower", label: "Showers" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { type: "snow", label: "Snow" };
  if ([95, 96, 99].includes(code)) return { type: "storm", label: "Thunder" };
  return { type: "waiting", label: "Forecast" };
}

function renderPlaceholder(statusText) {
  weatherStatus.textContent = statusText;

  forecastGrid.innerHTML = DAY_LABELS.map((day, index) => `
    <article class="forecast-day">
      <div class="day-name">${day}</div>
      <div class="weather-icon">${iconSvg("waiting")}</div>
      <div class="temperatures">
        <span class="temp-high">--°</span>
        <span class="temp-low">--°</span>
      </div>
      <div class="condition">${17 + index} Aug</div>
    </article>
  `).join("");
}

function renderForecast(daily) {
  forecastGrid.innerHTML = daily.time.map((date, index) => {
    const weather = decodeWeather(daily.weather_code[index]);

    return `
      <article class="forecast-day" title="${weather.label}">
        <div class="day-name">${DAY_LABELS[index]}</div>
        <div class="weather-icon" aria-label="${weather.label}">
          ${iconSvg(weather.type)}
        </div>
        <div class="temperatures">
          <span class="temp-high">${Math.round(daily.temperature_2m_max[index])}°</span>
          <span class="temp-low">${Math.round(daily.temperature_2m_min[index])}°</span>
        </div>
        <div class="condition">${weather.label}</div>
      </article>
    `;
  }).join("");

  weatherStatus.textContent = "Latest Ratford outlook";
}

async function loadWeather() {
  const now = new Date();
  const stayStart = new Date(`${STAY.start}T00:00:00+01:00`);
  const daysUntilStay = Math.ceil((stayStart - now) / 86400000);

  if (daysUntilStay > 16) {
    renderPlaceholder(`Live forecast opens nearer the stay`);
    return;
  }

  const params = new URLSearchParams({
    latitude: STAY.latitude,
    longitude: STAY.longitude,
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: STAY.timezone,
    start_date: STAY.start,
    end_date: STAY.end
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    if (!response.ok) {
      throw new Error(`Forecast request failed with ${response.status}`);
    }

    const data = await response.json();

    if (!data.daily || data.daily.time.length !== STAY_DATES.length) {
      throw new Error("Complete stay forecast is not available.");
    }

    renderForecast(data.daily);
  } catch (error) {
    console.warn(error);
    renderPlaceholder("Forecast available nearer the stay");
  }
}

function enablePhotoParallax() {
  if (!propertyPhoto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const widget = document.querySelector(".stay-widget");

  widget.addEventListener("pointermove", event => {
    if (window.innerWidth <= 680) return;

    const rect = widget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    propertyPhoto.style.transform =
      `scale(1.06) translate(${x * -5}px, ${y * -4}px)`;
  });

  widget.addEventListener("pointerleave", () => {
    propertyPhoto.style.transform = "";
  });
}

updateCountdown();
loadWeather();
enablePhotoParallax();
