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

export const routeUrl =
	"https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
