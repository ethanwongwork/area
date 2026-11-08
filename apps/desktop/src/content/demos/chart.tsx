/** Chart gallery specimens: one kind per tile, one size per tile. docs/specs/chart.md (components audit N7, 2026-11-07). */
import { Card, CardHeader, CardTitle, Chart, ChartNumber } from "@area/react";

/* A chart takes its box's width; each tile gives it the same one. */
const box = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

/* A week of two values: placeholder series over dates, so the tiles compare marks, not a story. */
const WEEK = [
  { day: "Nov 1", one: 12, two: 8, three: 4 },
  { day: "Nov 2", one: 18, two: 11, three: 6 },
  { day: "Nov 3", one: 15, two: 14, three: 5 },
  { day: "Nov 4", one: 22, two: 12, three: 9 },
  { day: "Nov 5", one: 19, two: 16, three: 7 },
  { day: "Nov 6", one: 9, two: 6, three: 3 },
  { day: "Nov 7", one: 11, two: 7, three: 4 },
];
const SERIES = [{ key: "one", label: "Item one" }, { key: "two", label: "Item two" }];
const THREE = [...SERIES, { key: "three", label: "Item three" }];
const ONE = [{ key: "one", label: "Item one" }];
/* Parts of a whole, for the donut. */
const PARTS = [
  { item: "Item one", value: 42 },
  { item: "Item two", value: 28 },
  { item: "Item three", value: 18 },
  { item: "Item four", value: 12 },
];
const VALUE = [{ key: "value", label: "Value" }];

export const GalleryChart = () => <Chart style={box} label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartLine = () => <Chart style={box} kind="line" label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartArea = () => <Chart style={box} kind="area" label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartDonut = () => <Chart style={box} kind="donut" label="Label" data={PARTS} series={VALUE} x="item" />;
export const GalleryChartNumber = () => <ChartNumber label="Label" value="24,318" change="12.4%" direction="up" tone="success" note="vs. 21,640" />;
/* Stacked: each day's values in one column, 2 apart, the outermost rounded. */
export const GalleryChartStacked = () => <Chart style={box} stacked label="Label" data={WEEK} series={THREE} x="day" />;
export const GalleryChartAreaStacked = () => <Chart style={box} kind="area" stacked label="Label" data={WEEK} series={THREE} x="day" />;
/* One series needs no legend: the title names it. */
export const GalleryChartSingle = () => <Chart style={box} kind="line" label="Label" data={WEEK} series={ONE} x="day" />;
export const GalleryChartSm = () => <Chart style={box} size="sm" label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartMd = () => <Chart style={box} size="md" label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartLg = () => <Chart style={box} size="lg" label="Label" data={WEEK} series={SERIES} x="day" />;
/* The legend's toggles: Item two starts hidden; its key empties and its name is struck through. */
export const GalleryChartHidden = () => <Chart style={box} kind="line" label="Label" data={WEEK} series={THREE} x="day" defaultHiddenKeys={["two"]} />;
/* tableToggle: the data as Area's Table in the plot's place. */
export const GalleryChartTable = () => <Chart style={box} tableToggle defaultView="table" label="Label" xLabel="Date" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartLoading = () => <Chart style={box} loading label="Label" data={WEEK} series={SERIES} x="day" />;
export const GalleryChartEmpty = () => <Chart style={box} label="Label" data={[]} series={SERIES} x="day" emptyText="No values yet" />;
/* In a Card: the card's title names the chart, its number and its chart below. */
export const GalleryChartCard = () => (
  <Card style={box}>
    <CardHeader><CardTitle>Title</CardTitle></CardHeader>
    <ChartNumber label="Label" value="24,318" change="12.4%" direction="up" tone="success" note="vs. 21,640" />
    <Chart kind="area" size="sm" label="Title" data={WEEK} series={ONE} x="day" />
  </Card>
);
