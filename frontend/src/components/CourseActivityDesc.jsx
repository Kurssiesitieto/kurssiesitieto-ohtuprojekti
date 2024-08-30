import React, { useState } from "react";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import findDescription from "../functions/FindDescription";

export const CourseActivityDesc = (props) => {
  const [activityDescState, setActivityDescState] = useState(false);

  const handleInfoClick = () => {
    if (activityDescState) {
      setActivityDescState(false);
    } else {
      setActivityDescState(true);
    }
  };

  let desc = ["", ""];
  if (props.desc !== undefined) {
    desc = findDescription(props.desc, [
      "Järjestämisajankohta",
      "Ajoitus",
      "Suositeltava suoritusajankohta",
    ]);
  }

  return (
    <div>
      {(desc[0][1] || desc[1][1]) && (
        <div>
          <div className="timing">
            <h3>Suoritusaika</h3>
            <IconButton
              aria-label="info"
              data-testid="infoIcon"
              onClick={() => handleInfoClick()}
            >
              <InfoIcon />
            </IconButton>
          </div>
          {activityDescState && (
            <div>
              <p>{desc[0][1] || desc[1][1]}</p>
              <p>
                <b>Suositeltava suoritusajankohta:</b>
                {desc[2][1]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
