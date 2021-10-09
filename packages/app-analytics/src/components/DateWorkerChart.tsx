import ReactECharts from 'echarts-for-react'
import React from 'react'
import {AnalyticsData} from '../AppAnalytics'

const defaultChartOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    textStyle: {
      color: 'white',
    },
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: true,
      lineStyle: {
        opacity: 0.1,
        type: 'dashed',
      },
    },
    // splitNumber: 20,
    // axisLabel: {
    //   formatter(value) {
    //     const date = new Date(value)

    //     return [date.getMonth() + 1, date.getDate()].join('.')
    //   },
    // },
  },
  grid: [
    {
      left: '0px',
      right: '0px',
      bottom: '20px',
      top: '20px',
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Amount',
      splitLine: {show: false},
      axisPointer: {show: false},
      show: false,
    },
    {
      type: 'value',
      name: 'PHA',
      splitLine: {show: false},
      axisPointer: {show: false},
      show: false,
    },
  ],
  series: [
    {
      name: 'onlineWorkers',
      type: 'line',
      itemStyle: {color: '#bae445'},
      showSymbol: false,
      yAxisIndex: 0,
      data: [],
    },
    {
      name: 'workers',
      type: 'line',
      itemStyle: {color: '#03FFFF'},
      showSymbol: false,
      yAxisIndex: 1,
      data: [],
    },
  ],
}

export const DateWorkerChart: React.FC<{data: AnalyticsData}> = (props) => {
  const {data} = props

  const chartOptions = React.useMemo(() => {
    const formatData = (item: number) => item.toFixed(2)

    return Object.assign({}, defaultChartOptions, {
      series: [
        {
          ...defaultChartOptions.series[0],
          data: data?.map?.((item) => [
            item.date + 'T00:00:00.000Z',
            formatData(item.onlineWorkers),
          ]),
        },
        {
          ...defaultChartOptions.series[1],
          data: data?.map?.((item) => [
            item.date + 'T00:00:00.000Z',
            formatData(item.workers),
          ]),
        },
      ],
    })
  }, [data])

  return (
    <ReactECharts
      opts={{locale: 'en'}}
      option={chartOptions}
      style={{
        backgroundColor: 'white',
        height: 'auto',
        minHeight: '300px',
        flex: 1,
        width: '100%',
        margin: '0 auto 0',
      }}
    />
  )
}