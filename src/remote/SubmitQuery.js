function submitQuery(q) {
  const query = {
    dataset: q.dataset.id,
    names: [],
  };

  if (q.plotTitle !== null) {
    query.plotTitle = q.plotTitle;
  }

  const coords = q.coords.map((coord) => [
    parseFloat(coord.lat),
    parseFloat(coord.lon),
  ]);

  switch (q.plotType) {
    case "profile":
      query.variable_range = null;
      query.variable = q.dataset.variable;
      query.station = coords;
      query.showmap = false;
      query.time = q.dataset.time;
      break;
    case "timeseries":
      query.showmap = false;
      query.station = coords;
      query.variable = [q.dataset.variable];
      query.variable_range = null;
      query.depth = q.dataset.depth;
      query.starttime = q.dataset.starttime;
      query.endtime = q.dataset.time;
      query.interp = "gaussian";
      query.radius = 25;
      query.neighbours = 10;
      break;
    case "transect":
      query.variable = q.variable;
      query.time = q.dataset.time;
      query.variable_range = `${q.dataset.variable_scale[0]},${q.dataset.variable_scale[1]},auto`;
      query.path = coords;
      query.showmap = false;
      query.surfacevariable = q.surfacevariable;
      query.linearthresh = 200;
      query.depth_limit = 0;
      query.colormap = "default";
      query.selectedPlots = "0,1,1";
      break;
    case "map":
      query.time = q.dataset.time;
      query.variable_range = `${q.dataset.variable_scale[0]},${q.dataset.variable_scale[1]},auto`;
      query.depth = q.dataset.depth;
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

  const queryUrl = `https://navigator.oceansdata.ca/api/v2.0/plot/${
    q.plotType
  }?query=${encodeURIComponent(JSON.stringify(query))}&save=True&format=${
    q.outputFormat
  }`;
  return queryUrl;
}

export default submitQuery;
