import {useTheme} from "@geist-ui/core";
import {useEffect, useState} from "react";

function IndeterminateProgressBar() {
    const theme = useTheme();

    const [loadingColor, setLoadingColor] = useState("#3498db");

    useEffect(() => {
        if (theme) {
            if(theme.type === "light"){
                setLoadingColor("#c800ff");
            }
        }
    }, [theme])

    return (
        <div className="progress-bar">
            <div className="progress-bar__indeterminate"></div>
            <style jsx>{`
        .progress-bar {
          position: relative;
          width: 100%;
          height: 1px;
          background-color: transparent;
          overflow: hidden;
          margin-top: -1px;
        }

        .progress-bar__indeterminate {
          position: absolute;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            270deg,
            transparent,
            ${loadingColor},
            transparent
          );
          animation: loading 2s infinite;
        }

        @keyframes loading {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
        </div>
    );
}

export default IndeterminateProgressBar;
