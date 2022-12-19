import { useEffect, useRef } from 'react';
import { loadModules } from "esri-loader";
import "./Map.scss";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import esriConfig from "@arcgis/core/config";
import { firebaseAuth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function BucharestMap() {
    let
        map: Map,
        view: MapView,
        zoom = 14,
        center: Array<number> = [26.096306, 44.439663],
        basemap = "streets-navigation-vector",
        graphicsLayer: GraphicsLayer,
        pointCoords: number[] = [26.096306, 44.439663],
        pointGraphic: Graphic;

    const mapElement = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        map = new Map({
            basemap: basemap
        });

        esriConfig.apiKey = "AAPK8c1c645b82994e9f8c82acdc57febc098RwiOiGQUDWfauG-FNzYWqfJLlmIh01wSbF7fzHKvYZ7xQ3ygTe3yRG2R720qK8I";

        addFeatureLayers();
        // addGeoJSONLayer("https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0/query?where=1%3D1&outFields=addr_street,attraction,board_type,building,description,information,name,opening_hours,operator,phone,tourism,zoo,osm_id2,website&outSR=4326&f=json");
        // addPoint(pointCoords[1], pointCoords[0]);


        view = new MapView({
            map: map,
            center: center,
            zoom: zoom,
            container: mapElement.current as any,
        });




    });

    const addGeoJSONLayer = (url: string) => {
        const layer: __esri.GeoJSONLayer = new GeoJSONLayer({
            url: url
        });

        map.add(layer);
    }

    const addFeatureLayers = () => {
        const popupTrailheads = {
            "title": "Trailhead",
            "content": "{name}"
          }

        const trailheadsLayer: __esri.FeatureLayer = new FeatureLayer({
            url:
                "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
        });

        map.add(trailheadsLayer);


        // Trails feature layer (lines)
        const trailsLayer: __esri.FeatureLayer = new FeatureLayer({
            url:
                "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
        });

        map.add(trailsLayer, 0);

        // Parks and open spaces (polygons)
        const parksLayer: __esri.FeatureLayer = new FeatureLayer({
            url:
                "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
        });

        map.add(parksLayer, 0);

        // Tourist layer
        const touristAttractionsLayer: __esri.FeatureLayer = new FeatureLayer({
            url: "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0",
            popupTemplate: popupTrailheads
        });

        map.add(touristAttractionsLayer);

        touristAttractionsLayer.definitionExpression = "tourism = 'attraction' or tourism = 'zoo' or tourism = 'information' or tourism = 'artwork'";
    }

    const addPoint = (lat: number, lng: number) => {
        graphicsLayer = new GraphicsLayer();

        map.add(graphicsLayer);

        const point = { //Create a point
            type: "point",
            longitude: lng,
            latitude: lat
        };

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
        };

        pointGraphic = new Graphic({
            geometry: point as any,
            symbol: simpleMarkerSymbol
        });

        graphicsLayer.add(pointGraphic);
    }

    const logout = (e) => {
        e.preventDefault();

        firebaseAuth.signOut().then(function () {
            navigate('/auth', { replace: true });
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand ><Nav.Link href="/app">FeetForYou</Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto w-100">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="User" id="basic-nav-dropdown" className={'ms-auto'} >
                                {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider /> */}
                                <NavDropdown.Item onClick={logout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className={'map-view'} ref={mapElement}>
            </div>
        </>
    );
}

export default BucharestMap;