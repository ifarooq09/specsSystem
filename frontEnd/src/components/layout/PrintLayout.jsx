import { Avatar, Box } from "@mui/material";

/* eslint-disable react/prop-types */
const PrintLayout = ({ specDetails }) => {
  if (!specDetails) {
    return <div>Loading...</div>;
  }

  const processDescription = (description) => {
    // Split the description by newlines
    const lines = description.split("\n");

    // Process each line
    return (
      <div>
        {lines.map((line, index) => {
          // If the line starts with "-", convert it to a list item
          if (line.trim().startsWith("-")) {
            return (
              <ul
                key={index}
                style={{ margin: 0, paddingLeft: "1em", textAlign: "left" }}
              >
                <li style={{ listStyleType: "disc", marginLeft: "1em" }}>
                  {line.trim().substring(1).trim()}
                </li>
              </ul>
            );
          } else {
            // Otherwise, return the line as a paragraph
            return (
              <p
                key={index}
                style={{ margin: 0, textAlign: "left", fontWeight: "bold" }}
              >
                {line}
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Avatar
          src="/MAILLogoTransparent.png"
          sx={{ width: 140, height: 140, marginLeft: "10px" }}
        />
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <strong>امارت اسلامی افغانستان</strong>
          <strong>وزارت زراعت، آبیاری و مالداری</strong>
          <strong>معینیت مالی و اداری</strong>
          <strong>ریاست تکنالوژی معلوماتی</strong>
          <strong>آمریت خدمات تکنالوژی معلوماتی</strong>
          <strong>
            مدیریت عمومی خدمات و تعین مشخصات وسایل تکنالوژی معلوماتی
          </strong>
        </p>
        <Box
          component="img"
          src="/IEA_logo.jpg"
          sx={{ width: 160, height: 160, objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <strong
            style={{
              direction: "ltr",
              unicodeBidi: "isolate",
              marginRight: "5px",
            }}
          >
            {specDetails.uniqueNumber}
          </strong>
          <strong>:شماره فورم </strong>
        </div>
        <div>
          <strong>درخواست کننده: </strong> {specDetails.directorate.name}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <table
          style={{
            border: "2px solid",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "2px solid", padding: "5px", width: "10%" }}>
                شماره
              </th>
              <th style={{ border: "2px solid", padding: "5px", width: "20%" }}>
                نوع جنس
              </th>
              <th style={{ border: "2px solid", padding: "5px", width: "50%" }}>
                مشخصات وسایل
              </th>
              <th style={{ border: "2px solid", padding: "5px", width: "20%" }}>
                تضمین
              </th>
            </tr>
          </thead>
          <tbody>
            {specDetails.specifications.map((spec, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "2px solid",
                    padding: "5px",
                    width: "10%",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    border: "2px solid",
                    padding: "5px",
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  {spec.category.categoryName}
                </td>
                <td
                  style={{
                    border: "2px solid",
                    padding: "5px",
                    width: "50%",
                    textAlign: "center",
                  }}
                >
                  {processDescription(spec.description)}
                </td>
                <td
                  style={{
                    border: "2px solid",
                    padding: "5px",
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  {spec.warranty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          textAlign: "right",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <p>
          چون بازار وسایل تکنالوژی معلوماتی به سرعت در حال تغیر میباشد در صورت
          عدم پیدایش جنس مذکور بعد از یک ماه ریاست تکنالوژی معلوماتی مسئولیت
          ندارد
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        {/* Right Side Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>سید طارق شاه واقف</span>
            <strong style={{ marginLeft: "10px" }}>: تائید کننده</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>آمر خدمات تکنالوژی معلوماتی</span>
            <strong style={{ marginLeft: "10px" }}>: وظیفه</strong>
          </div>
          <div>
            <strong style={{ marginLeft: "10px" }}>: تاریخ</strong>
          </div>
          <div>
            <strong style={{ marginLeft: "10px" }}>: امضا</strong>
          </div>
        </div>

        {/* Left Side Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>محمد نعمان شیرزی</span>
            <strong style={{ marginLeft: "10px" }}>: ترتیب کننده</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>مدیر عمومی خدمات و تعیین مشخصات خدمات تکنالوژی معلوماتی</span>
            <strong style={{ marginLeft: "10px" }}>: وظیفه</strong>
          </div>
          <div>
            <strong style={{ marginLeft: "10px" }}>: تاریخ</strong>
          </div>
          <div>
            <strong style={{ marginLeft: "10px" }}>: امضا</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintLayout;
