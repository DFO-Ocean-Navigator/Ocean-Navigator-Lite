function submitQuery(q) {
  const query = {
    type: q.type,
    dataset: q.dataset.id,
    variable: q.variable.id,
    names: [],
    plotTitle: ''
  };

  const coords = q.coords.map(coord=>[parseFloat(coord[1]),parseFloat(coord[2])]);
  
  switch(q.type) {
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
      query.time = q.time;
      query.scale = q.scale;
      query.path = q.path;
      query.showmap = q.showmap;
      query.surfacevariable = q.surfacevariable;
      query.linearthresh = q.linearthresh;
      query.name = q.name;
      query.depth_limit = q.depth_limit;
      query.colormap = q.colormap;
      query.selectedPlots = q.selectedPlots;
      break;
    case "map":
      query.variable = q.variable;
      query.time = q.time;
      query.scale = q.scale;
      query.depth = q.depth;
      query.colormap = q.colormap;
      query.area = q.area;
      query.projection = q.projection;
      query.bathymetry = q.bathymetry;
      query.quiver = q.quiver;
      query.contour = q.contour;
      query.showarea = q.showarea;
      query.interp = q.interp;
      query.radius = q.radius;
      query.neighbours = q.neighbours;
      break;
  };

  const queryUrl = "plot/?query=" + encodeURIComponent(JSON.stringify(query)) + '&save&format=csv&size=10x7&dpi=144'; 

  return queryUrl;
};


export default submitQuery