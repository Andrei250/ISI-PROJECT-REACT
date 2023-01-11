import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { Attraction } from "../models/attraction.model";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sortWithoutLocation = (
	attractions: Attraction[]
): Attraction[] => {
	for (let i = 0; i < attractions.length - 1; ++i) {
		for (let j = i; j < attractions.length; ++j) {
			if (attractions[i].long < attractions[j].long) {
				let tmp = attractions[i];
				attractions[i] = attractions[j];
				attractions[j] = tmp;
			}
		}
	}

	return attractions;
};

export const sortWithLocation = (
	attractions: Attraction[],
	person: { lat: number; long: number }
): Attraction[] => {
	for (let i = 0; i < attractions.length - 1; ++i) {
		for (let j = i; j < attractions.length; ++j) {
			if (
				distanceBetweenPoints(person, {
					lat: attractions[j].lat,
					long: attractions[j].long,
				}) <
				distanceBetweenPoints(person, {
					lat: attractions[i].lat,
					long: attractions[i].long,
				})
			) {
				let tmp = attractions[i];
				attractions[i] = attractions[j];
				attractions[j] = tmp;
			}
		}
	}

	return attractions;
};

const distanceBetweenPoints = (
	pointA: { lat: number; long: number },
	pointB: { lat: number; long: number }
) => {
	return Math.sqrt(
		(pointA.lat - pointB.lat) * (pointA.lat - pointB.lat) +
			(pointA.long - pointB.long) * (pointA.long - pointB.long)
	);
};

export const routeUrl =
	"https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

export const graphicLayerPoints = [
	[44.442393386780466, 25.96645459629871],
	[44.444295398915436, 26.014840799962524],
	[44.45581438335037, 26.015527445460492],
	[44.46733109598641, 25.97398539283353],
	[44.51313040876775, 26.009004313229813],
	[44.54029908737451, 26.104104714698142],
	[44.48815342376711, 26.11474771991662],
	[44.479580423452155, 26.179635719710763],
	[44.456304501978906, 26.15766306377584],
	[44.43350960896833, 26.225640968064653],
	[44.39574366835255, 26.22083444957889],
	[44.39598898040537, 26.17002268272939],
	[44.3692439136097, 26.1432435083087],
	[44.34248662881126, 26.167619423486506],
	[44.33512009439294, 26.154573159025144],
	[44.366789625875974, 26.10170145568174],
	[44.384458202894024, 26.035096841862064],
	[44.405064804056494, 26.011064249433243],
	[44.40187616181026, 26.004197794453585],
	[44.40359314461597, 26.00213785795969],
	[44.40383842376039, 25.996988016724938],
	[44.405064804056494, 25.995614725729006],
	[44.405064804056494, 25.992181498239177],
	[44.406291158642794, 25.992524820988155],
	[44.40627071158203, 25.975684441807836],
	[44.42341198992875, 25.967562177759802],
	[44.442393386780466, 25.96645459629871],
];

export const graphicsLayer: GraphicsLayer = new GraphicsLayer({
	title: "Attractions",
});
