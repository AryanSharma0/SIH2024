import React, { useEffect, useState } from "react";

const useVehicle2DemoMotion = () => {
  const [vehicle2Path, setVehicle2Path] = useState([
    { lng: 83.0211573308103, lat: 18.852254518152055 },

    { lng: 83.02123243266271, lat: 18.853361222804566 },

    { lng: 83.0212109749906, lat: 18.855564457124483 },

    { lat: 18.856701599001656, lng: 83.02186543399023 },

    { lng: 83.02284175807165, lat: 18.85740215578538 },

    { lng: 83.024055119977, lat: 18.85787857280607 },

    { lng: 83.0248812403536, lat: 18.858183160934477 },

    { lng: 83.0257824625826, lat: 18.85915783922884 },

    { lng: 83.02658935386339, lat: 18.85993357543005 },

    { lng: 83.0271687110106, lat: 18.860837174193865 },

    { lng: 83.02775879699388, lat: 18.86173730354277 },

    { lat: 18.86249875530874, lng: 83.02815576392808 },

    { lng: 83.02869635053808, lat: 18.863296396013997 },

    { lat: 18.864098450987115, lng: 83.0294366402262 },

    { lat: 18.86470760409973, lng: 83.03014474340613 },

    { lng: 83.0310542280066, lat: 18.865810725649155 },

    { lat: 18.866348805517976, lng: 83.03154775446534 },

    { lng: 83.03189107721924, lat: 18.866734597568577 },

    { lng: 83.0324060613501, lat: 18.867343741104303 },

    { lat: 18.867912273074218, lng: 83.0328566724646 },

    { lat: 18.868571727452988, lng: 83.03340535215511 },

    { lat: 18.86903873257758, lng: 83.03384523443356 },

    { lat: 18.869526040885805, lng: 83.03422074369564 },

    { lng: 83.03456406644955, lat: 18.87004380441116 },

    { lat: 18.870378827016573, lng: 83.03482155851498 },

    { lat: 18.870713848952423, lng: 83.03517561010494 },

    { lat: 18.871191000250576, lng: 83.03544383100643 },

    { lng: 83.03585700039953, lat: 18.871916980082673 },

    { lat: 18.872589123095334, lng: 83.03637437617468 },

    { lat: 18.873465769952563, lng: 83.03686338071685 },

    { lng: 83.03723888997894, lat: 18.874085040994515 },

    { lat: 18.874623094304333, lng: 83.03758221273284 },

    { lng: 83.03794699315887, lat: 18.875211905380795 },

    { lng: 83.03835468892913, lat: 18.875739803207743 },

    { lat: 18.87635906584668, lng: 83.03878384237152 },

    { lng: 83.03927736883026, lat: 18.877130602981957 },

    { lng: 83.03963142042022, lat: 18.877678798261414 },

    { lat: 18.878348812278478, lng: 83.04003911619048 },

    { lng: 83.04025369291168, lat: 18.878714273340343 },

    { lng: 83.04043608312469, lat: 18.879242160133515 },

    { lat: 18.880013683993244, lng: 83.04075794820648 },

    { lat: 18.88036898983905, lng: 83.04099398259979 },

    { lat: 18.880795355859362, lng: 83.04124074582916 },

    { lng: 83.041573339747, lat: 18.88150596348187 },

    { lng: 83.04170208577972, lat: 18.881749599687126 },

    { lng: 83.04216342573028, lat: 18.882602323615107 },

    { lat: 18.883979115148488, lng: 83.04295468221862 },

    { lng: 83.04334092031677, lat: 18.885187123353205 },

    { lng: 83.04396319280822, lat: 18.88612103969107 },

    { lng: 83.04483222852905, lat: 18.8873188812836 },

    { lat: 18.88857762084354, lng: 83.04583001028259 },

    { lng: 83.04648446928222, lat: 18.889501367242868 },

    { lat: 18.890313447780343, lng: 83.04693508039672 },

    { lng: 83.04765776162517, lat: 18.891546826164703 },

    { lat: 18.89214572862585, lng: 83.04800108437908 },

    { lng: 83.04831222062481, lat: 18.892876589743736 },

    { lat: 18.89360744767102, lng: 83.04874137406719 },

    { lat: 18.894369747986524, lng: 83.04909421579531 },

    { lng: 83.04929806368044, lat: 18.894958489648804 },
  ]);
  const [vehical2Data, setVehical2Data] = useState({
    lat: 0.0,
    lng: 0.0,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log(vehicle2Path[count], vehicle2Path.length, count);
      setVehical2Data({
        lat: vehicle2Path[count].lat,
        lng: vehicle2Path[count].lng,
      });
      if (count === vehicle2Path.length - 1) {
        setCount(0);
      } else {
        setCount((prev) => prev + 1);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    }; // Cleanup interval on component unmount
  }, [count]);
  return vehical2Data;
};

const useVehicle3DemoMotion = () => {
  const [vehicle2Path, setVehicle2Path] = useState([
    { lng: 83.0211573308103, lat: 18.852254518152055 },

    { lng: 83.02123243266271, lat: 18.853361222804566 },

    { lng: 83.0212109749906, lat: 18.855564457124483 },

    { lat: 18.856701599001656, lng: 83.02186543399023 },

    { lng: 83.02284175807165, lat: 18.85740215578538 },

    { lng: 83.024055119977, lat: 18.85787857280607 },

    { lng: 83.0248812403536, lat: 18.858183160934477 },

    { lng: 83.0257824625826, lat: 18.85915783922884 },

    { lng: 83.02658935386339, lat: 18.85993357543005 },

    { lng: 83.0271687110106, lat: 18.860837174193865 },

    { lng: 83.02775879699388, lat: 18.86173730354277 },

    { lat: 18.86249875530874, lng: 83.02815576392808 },

    { lng: 83.02869635053808, lat: 18.863296396013997 },

    { lat: 18.864098450987115, lng: 83.0294366402262 },

    { lat: 18.86470760409973, lng: 83.03014474340613 },

    { lng: 83.0310542280066, lat: 18.865810725649155 },

    { lat: 18.866348805517976, lng: 83.03154775446534 },

    { lng: 83.03189107721924, lat: 18.866734597568577 },

    { lng: 83.0324060613501, lat: 18.867343741104303 },

    { lat: 18.867912273074218, lng: 83.0328566724646 },

    { lat: 18.868571727452988, lng: 83.03340535215511 },

    { lat: 18.86903873257758, lng: 83.03384523443356 },

    { lat: 18.869526040885805, lng: 83.03422074369564 },

    { lng: 83.03456406644955, lat: 18.87004380441116 },

    { lat: 18.870378827016573, lng: 83.03482155851498 },

    { lat: 18.870713848952423, lng: 83.03517561010494 },

    { lat: 18.871191000250576, lng: 83.03544383100643 },

    { lng: 83.03585700039953, lat: 18.871916980082673 },

    { lat: 18.872589123095334, lng: 83.03637437617468 },

    { lat: 18.873465769952563, lng: 83.03686338071685 },

    { lng: 83.03723888997894, lat: 18.874085040994515 },

    { lat: 18.874623094304333, lng: 83.03758221273284 },

    { lng: 83.03794699315887, lat: 18.875211905380795 },

    { lng: 83.03835468892913, lat: 18.875739803207743 },

    { lat: 18.87635906584668, lng: 83.03878384237152 },

    { lng: 83.03927736883026, lat: 18.877130602981957 },

    { lng: 83.03963142042022, lat: 18.877678798261414 },

    { lat: 18.878348812278478, lng: 83.04003911619048 },

    { lng: 83.04025369291168, lat: 18.878714273340343 },

    { lng: 83.04043608312469, lat: 18.879242160133515 },

    { lat: 18.880013683993244, lng: 83.04075794820648 },

    { lat: 18.88036898983905, lng: 83.04099398259979 },

    { lat: 18.880795355859362, lng: 83.04124074582916 },

    { lng: 83.041573339747, lat: 18.88150596348187 },

    { lng: 83.04170208577972, lat: 18.881749599687126 },

    { lng: 83.04216342573028, lat: 18.882602323615107 },

    { lat: 18.883979115148488, lng: 83.04295468221862 },

    { lng: 83.04334092031677, lat: 18.885187123353205 },

    { lng: 83.04396319280822, lat: 18.88612103969107 },

    { lng: 83.04483222852905, lat: 18.8873188812836 },

    { lat: 18.88857762084354, lng: 83.04583001028259 },

    { lng: 83.04648446928222, lat: 18.889501367242868 },

    { lat: 18.890313447780343, lng: 83.04693508039672 },

    { lng: 83.04765776162517, lat: 18.891546826164703 },

    { lat: 18.89214572862585, lng: 83.04800108437908 },

    { lng: 83.04831222062481, lat: 18.892876589743736 },

    { lat: 18.89360744767102, lng: 83.04874137406719 },

    { lat: 18.894369747986524, lng: 83.04909421579531 },

    { lng: 83.04929806368044, lat: 18.894958489648804 },
  ]);
  const [vehicalData, setVehicalData] = useState({
    lat: 0.0,
    lng: 0.0,
  });
  const [count, setCount] = useState(vehicle2Path.length - 1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log(vehicle2Path[count], vehicle2Path.length, count);
      setVehicalData({
        lat: vehicle2Path[count].lat,
        lng: vehicle2Path[count].lng,
      });
      if (count === 0) {
        setCount(vehicle2Path.length - 1);
      } else {
        setCount((prev) => prev - 1);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    }; // Cleanup interval on component unmount
  }, [count]);
  return vehicalData;
};

export { useVehicle2DemoMotion, useVehicle3DemoMotion };
