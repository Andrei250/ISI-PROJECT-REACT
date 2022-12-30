import { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";
import "./Map.scss";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Locate from "@arcgis/core/widgets/Locate";
import esriConfig from "@arcgis/core/config";
import firebase, { firebaseAuth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Attraction } from "../../models/attraction.model";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import * as route from "@arcgis/core/rest/route";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

function BucharestMap() {
	let map: Map,
		view: MapView,
		zoom = 14,
		center: Array<number> = [26.096306, 44.439663],
		basemap = "streets-navigation-vector",
		graphicsLayer: GraphicsLayer,
		graphicsLayerFavourite: GraphicsLayer,
		pointGraphic: Graphic,
		favouriteGraphic: Graphic;

	const mapElement = useRef(null);
	const navigate = useNavigate();
	const attractions: Attraction[] = [];
	const routeUrl =
		"https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

	map = new Map({
		basemap: basemap,
	});

	esriConfig.apiKey =
		"AAPK8c1c645b82994e9f8c82acdc57febc098RwiOiGQUDWfauG-FNzYWqfJLlmIh01wSbF7fzHKvYZ7xQ3ygTe3yRG2R720qK8I";

	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	const [details, setDetails] = useState("");
	const [favouriteCoords, setFavouriteCoords] = useState([] as Array<number>);

	const handleClose = () => setShow(false);
	const handleShow = () => {
		if (favouriteCoords.length < 1) return;

		setShow(true);
	};

	useEffect(() => {
		view = new MapView({
			map: map,
			center: center,
			zoom: zoom,
			container: mapElement.current as any,
		});
		const locate = new Locate({
			view: view,
			useHeadingEnabled: false,
			goToOverride: function (view, options) {
				options.target.scale = 5000;
				return view.goTo(options.target);
			},
		});
		view.ui.add(locate, "top-left");

		view.on("click", function (event) {
			var lat = Math.round(event.mapPoint.latitude * 1000000) / 1000000;
			var lon = Math.round(event.mapPoint.longitude * 1000000) / 1000000;
			const arr = [lat, lon];

			addFavouritePoint(lat, lon);
			setFavouriteCoords(arr);
		});

		addFeatureLayers();

		getAttractions();
	}, []);

	async function getAttractions() {
		firebase
			.database()
			.ref("/attractions")
			.on("value", (snapshot) => {
				if (snapshot.exists()) {
					snapshot.forEach((element) => {
						const attraction: Attraction = element.val();

						attractions.push(attraction);

						addPoint(
							attraction.lat,
							attraction.long,
							attraction.title
						);
					});
				}
			});

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.database()
					.ref("/favourites/" + user.uid)
					.on("value", (snapshot) => {
						if (snapshot.exists()) {
							snapshot.forEach((element) => {
								const attraction: Attraction = element.val();

								attractions.push(attraction);

								addPoint(
									attraction.lat,
									attraction.long,
									attraction.title
								);
							});
						}
					});
			}
		});
	}

	function getRoute() {
		const routeParams = new RouteParameters({
			stops: new FeatureSet({
				features: view.graphics.toArray(),
			}),
		});

		route.solve(routeUrl, routeParams).then(function (data) {
			data.routeResults.forEach(function (result) {
				result.route.symbol = {
					type: "simple-line",
					color: [5, 150, 255] as any,
					width: 3,
				} as any;
				view.graphics.add(result.route);
			});
		});
	}

	const addGeoJSONLayer = (url: string) => {
		const layer: __esri.GeoJSONLayer = new GeoJSONLayer({
			url: url,
		});

		map.add(layer);
	};

	const addFeatureLayers = () => {
		const popupTrailheads = {
			title: "{name}",
		};

		const trailheadsLayer: __esri.FeatureLayer = new FeatureLayer({
			url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
		});

		map.add(trailheadsLayer);

		// Trails feature layer (lines)
		const trailsLayer: __esri.FeatureLayer = new FeatureLayer({
			url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
		});

		map.add(trailsLayer, 0);

		// Parks and open spaces (polygons)
		const parksLayer: __esri.FeatureLayer = new FeatureLayer({
			url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
		});

		map.add(parksLayer, 0);

		// Tourist layer
		const touristAttractionsLayer: __esri.FeatureLayer = new FeatureLayer({
			url: "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0",
			popupTemplate: popupTrailheads,
		});

		map.add(touristAttractionsLayer);

		// touristAttractionsLayer.definitionExpression =
		// 	"tourism = 'attraction' or tourism = 'zoo' or tourism = 'information' or tourism = 'artwork'";
		touristAttractionsLayer.definitionExpression = "tourism = 'artwork'";
	};

	const addPoint = (lat: number, lng: number, title: String) => {
		graphicsLayer = new GraphicsLayer();

		map.add(graphicsLayer);

		const point = {
			//Create a point
			type: "point",
			longitude: lng,
			latitude: lat,
		};

		const popupTrailheads = {
			title: title,
		};

		const simpleMarkerSymbol = {
			type: "simple-marker",
			color: [226, 119, 40], // Orange
			outline: {
				color: [255, 255, 255], // White
				width: 1,
			},
		};

		pointGraphic = new Graphic({
			geometry: point as any,
			symbol: simpleMarkerSymbol,
			popupTemplate: popupTrailheads as any,
		});

		graphicsLayer.add(pointGraphic);

		// view.graphics.add(pointGraphic);
	};

	const addFavouritePoint = (lat: number, lng: number) => {
		if (graphicsLayerFavourite !== undefined)
			graphicsLayerFavourite.remove(favouriteGraphic);

		graphicsLayerFavourite = new GraphicsLayer();

		map.add(graphicsLayerFavourite);

		const point = {
			//Create a point
			type: "point",
			longitude: lng,
			latitude: lat,
		};

		const simpleMarkerSymbol = {
			type: "simple-marker",
			color: [226, 119, 40], // Orange
			outline: {
				color: [255, 255, 255], // White
				width: 1,
			},
		};

		favouriteGraphic = new Graphic({
			geometry: point as any,
			symbol: simpleMarkerSymbol,
		});

		graphicsLayerFavourite.add(favouriteGraphic);
	};

	const logout = (e) => {
		e.preventDefault();

		firebaseAuth
			.signOut()
			.then(function () {
				navigate("/auth", { replace: true });
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const user = firebaseAuth.currentUser;

		if (user && title.length > 0 && details.length > 0) {
			const data = {
				lat: favouriteCoords[0],
				long: favouriteCoords[1],
				title: title,
				details: details,
			};

			firebase
				.database()
				.ref("/favourites")
				.child(user.uid)
				.push(data)
				.then((ev) => {
					setFavouriteCoords([]);
					setTitle("");
					setDetails("");
					setShow(false);
				});
		}
	};

	return (
		<>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand>
						<Nav.Link href="/app">FeetForYou</Nav.Link>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto w-100">
							<Nav.Link onClick={handleShow}>
								Add Favourite
							</Nav.Link>
							<Nav.Link>Plan a trip</Nav.Link>
							<NavDropdown
								title="User"
								id="basic-nav-dropdown"
								className={"ms-auto"}
							>
								<NavDropdown.Item onClick={logout}>
									Logout
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>Add favourite place</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
						<Form.Control
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Title"
							aria-label="Title"
						/>
					</InputGroup>

					<InputGroup>
						<Form.Control
							onChange={(event) => setDetails(event.target.value)}
							as="textarea"
							aria-label="Details"
						/>
					</InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>

			<div className={"map-view"} ref={mapElement}></div>
		</>
	);
}

export default BucharestMap;
