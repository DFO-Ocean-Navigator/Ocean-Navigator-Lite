function submitQuery(q) {
  const query = {
    type: q.type,
    dataset: q.dataset.id,
    variable: q.variable.id,
    names: [],
    plotTitle: "",
  };

  const coords = q.coords.map((coord) => [
    parseFloat(coord.lon),
    parseFloat(coord.lat),
  ]);

  switch (q.type) {
    case "profile":
      query.station = coords;
      query.showmap = 0;
      query.time = q.startTime;
      break;
    case "timeseries":
      query.showmap = 0;
      query.station = coords;
      query.depth = q.depth;
      query.starttime = q.startTime;
      query.endtime = q.endTime;
      break;
    case "transect":
      query.time = q.startTime;
      query.scale = `${q.variable.scale[0]},${q.variable.scale[1]},auto`;
      query.path = coords;
      query.showmap = 0;
      query.surfacevariable = "none";
      query.linearthresh = 200;
      query.depth_limit = 0;
      query.selectedPlots = "0,1,1";
      break;
    case "map":
      query.time = q.startTime;
      query.scale = `${q.variable.scale[0]},${q.variable.scale[1]},auto`;
      query.depth = q.depth;
      query.colormap = "default";
      query.area = [
        {
          innerrings: [],
          name: "",
          polygons: [coords],
        },
      ];
      query.projection = "EPSG:3857";
      query.quiver = {
        colormap: "default",
        magnitude: "length",
        variable: "none",
      };
      query.contour = {
        colormap: "default",
        hatch: false,
        legend: true,
        levels: "auto",
        variable: "none",
      };
      query.showarea = true;
      query.interp = "gaussian";
      query.radius = 25;
      query.neighbours = 10;
      break;
  }

  const queryUrl =
    "https://staging.oceansdata.ca/api/v1.0/plot/?query=" +
    encodeURIComponent(JSON.stringify(query)) +
    "&save&format=csv&size=10x7&dpi=144";

  return queryUrl;
}

export default submitQuery;
