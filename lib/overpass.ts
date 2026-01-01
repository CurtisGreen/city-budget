const query = `
    [out:json];
    area["name"="Dallas County"]->.boundaryArea;
    (
        wr(area.boundaryArea)["name"="Addison"]["boundary"="administrative"]["admin_level"="8"];
        wr(area.boundaryArea)["name"="Farmers Branch"]["boundary"="administrative"]["admin_level"="8"];
        wr(area.boundaryArea)["name"="Dallas"]["boundary"="administrative"]["admin_level"="8"];
    );
    out geom qt;
`;
