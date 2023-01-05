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
