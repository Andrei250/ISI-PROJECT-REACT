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

function BucharestMap() {
    let
        map: Map,
        view: MapView,
        zoom = 10,
        center: Array<number> = [26.096306, 44.439663],
        basemap = "streets-vector",
        graphicsLayer: GraphicsLayer,
        pointCoords: number[] = [26.096306, 44.439663],
        pointGraphic: Graphic;

    const mapElement = useRef(null);

    useEffect(() => {
        map = new Map({
            basemap: basemap
        });

        // esriConfig.apiKey = "AAPK8c1c645b82994e9f8c82acdc57febc098RwiOiGQUDWfauG-FNzYWqfJLlmIh01wSbF7fzHKvYZ7xQ3ygTe3yRG2R720qK8I";

        addFeatureLayers();
        addPoint(pointCoords[1], pointCoords[0]);

        view = new MapView({
            map: map,
            center: center,
            zoom: zoom,
            container: mapElement.current as any,
        });


    });

    const addFeatureLayers = () => {
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
            url: "https://services.arcgis.com/.../FeatureServer/0"
        });

        map.add(touristAttractionsLayer);
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

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand ><Nav.Link href="/app">FeetForYou</Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
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