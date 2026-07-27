const forecast = [
  {
    day: "Mon",
    high: 24,
    low: 17,
    condition: "Mostly sunny",
    icon: "sun"
  },
  {
    day: "Tue",
    high: 28,
    low: 15,
    condition: "Partly sunny",
    icon: "partly"
  },
  {
    day: "Wed",
    high: 29,
    low: 15,
    condition: "Mostly sunny",
    icon: "sun"
  },
  {
    day: "Thu",
    high: 24,
    low: 11,
    condition: "Partly sunny",
    icon: "partly"
  },
  {
    day: "Fri",
    high: 24,
    low: 11,
    condition: "Partial sunshine",
    icon: "partly"
  }
];

const forecastGrid =
  document.getElementById(
    "forecast-grid"
  );

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
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
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
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
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

            a8.5 8.5 0 0 0
            -15.9 2.2

            A4.5 4.5 0 0 0
            11 29Z
          "
          ${strokeSettings}
        ></path>
      </svg>
    `,

    cloud: `
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path
          d="
            M9 29h21

            a6 6 0 0 0
            .3-12

            a9.8 9.8 0 0 0
            -18.6 2.7

            A5 5 0 0 0
            9 29Z
          "
          ${strokeSettings}
        ></path>
      </svg>
    `,

    rain: `
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path
          d="
            M9 24h21

            a6 6 0 0 0
            .3-12

            a9.8 9.8 0 0 0
            -18.6 2.7

            A5 5 0 0 0
            9 24Z
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

function renderForecast() {
  forecastGrid.innerHTML =
    forecast
      .map(day => {
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
                ${day.high}°
              </span>

              <span class="temperature-low">
                ${day.low}°
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

renderForecast();
