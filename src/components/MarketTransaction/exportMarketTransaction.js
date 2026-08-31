import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { _getStorageValue } from "../../comman/localStorage";
import { ACCESS_TOKEN, USER_ID } from "../../comman/constants";
import { ecelExport, marketTransactionExportUrl } from "../../comman/urls";
import CircularProgress from "@material-ui/core/CircularProgress";

const ExportMarketTransaction = (props) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isloading, setLoading] = useState(false);

  const handleClose = () => {
    setType("");
    setStartDate("");
    setEndDate("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth returns zero-based index
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const onChangeHandler = (e) => {
    setType(e.target.value);
  };

  const isBefore = (date1, date2) => {
    return date1 <= date2;
  };

  const submit = () => {
    if (!!startDate && !!endDate) {
      if (!isBefore(startDate, endDate)) {
        toast.error("Please enter valid date", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        let start = formatDate(startDate);
        let end = formatDate(endDate);
        _getStorageValue(USER_ID).then(async (id) => {
          _getStorageValue(ACCESS_TOKEN).then(async (token) => {
            let marketTransactionExport = marketTransactionExportUrl(
              id,
              start,
              end,
            );
            setLoading(true);
            const response = await axios.get(marketTransactionExport, {
              headers: {
                authorization: token,
              },
              responseType: "blob", // Important for binary data like PDFs
            });
            console.log("response", response);
            if (response.status) {
              const blob = new Blob([response.data], {
                type: "application/xlsx",
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${new Date().getTime()}_report.xlsx`;
              a.click();
              setLoading(false);
              handleClose();
            } else {
              toast.error(response.message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              setLoading(false);
              handleClose();
            }
          });
        });
      }
    } else {
      toast.error("Please enter all the fields", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <>
      <div className="export-Button">
        <button onClick={handleShow}>Export</button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Export </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isloading ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="search-element">
                <label>
                  Start Date <span className="manditary">*</span>
                </label>
                <div className="down-arrow">
                  <DatePicker
                    selected={startDate}
                    className="exportDate"
                    onChange={(e) => {
                      setStartDate(e);
                      if (!!endDate) {
                        if (!isBefore(e, endDate)) {
                          setEndDate("");
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="search-element">
                <label>
                  End Date <span className="manditary">*</span>
                </label>
                <div className="down-arrow">
                  <DatePicker
                    selected={endDate}
                    className="exportDate"
                    onChange={(e) => {
                      if (!isBefore(startDate, e)) {
                        toast.error("Please choose valid date", {
                          position: toast.POSITION.BOTTOM_CENTER,
                        });
                      } else {
                        setEndDate(e);
                      }
                    }}
                  />
                </div>
              </div>
              {/* <div className="search-element">
          <label>
            Type <span className="manditary">*</span>
          </label>
          <div className="down-arrow">
            <select
              value={type}
              name="state"
              onChange={(e) => onChangeHandler(e)}
            >
              <option value="" label="Select" />
            { props.geoLocation? <><option  value={"distance"} label={"Distance"} />
              <option value={"user_location"} label={"User Location"} /></> :<>
               <option  value={"branch"} label={"Branch"} />
              <option value={"agency"} label={"Agency"} /> </>}
            </select>
          </div>
          </div> */}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            color={"#053c6d"}
            variant="primary"
            onClick={() => {
              submit();
            }}
          >
            export excel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExportMarketTransaction;
