import React from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { BarangayOfficial, BlotterDocDetails } from "@/app/pdf/actions";

type Props = {
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
  data: BlotterDocDetails;
};

const BlotterReportPdf = (props: Props) => {
  // Register the font
  Font.register({
    family: "Times New Roman",
    fonts: [
      { src: "/Times New Roman.ttf" }, // Update this path to where you store your font files
      { src: "/Times New Roman.ttf", fontStyle: "normal", fontWeight: "bold" },
      {
        src: "/Times New Roman.ttf",
        fontStyle: "italic",
      },
      {
        src: "/Times New Roman.ttf",
        fontStyle: "italic",
        fontWeight: "normal",
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Times New Roman",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerText: {
      textAlign: "center",
      fontSize: 12,
      marginBottom: 5,
    },
    title: {
      textAlign: "center",
      fontSize: 18,
      marginBottom: 30,
      fontWeight: "bold",
    },
    subtitle: {
      textAlign: "center",
      fontSize: 14,
      marginTop: 40,
      marginBottom: 10,
      fontWeight: "bold",
    },
    body: {
      fontSize: 12,
      marginVertical: 10,
      lineHeight: 1.5,
      fontWeight: "bold",
    },
    paragraph: {
      fontSize: 12,
      marginVertical: 5,
      textIndent: "50px",
      textAlign: "justify",
    },
    signatureSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 40,
      fontSize: 12,
    },
    signatureBox: {
      width: "45%",
      textAlign: "left",
      fontSize: 12,
    },
    footerSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 40,
      fontSize: 12,
    },
    watermark: {
      position: "absolute",
      width: "400px",
      height: "400px",
      opacity: 0.1,
      top: "30%",
      left: "20%",
    },
    twoBoxSection: {
      display: "flex",
      flexDirection: "row",
      marginTop: 40,
    },
    box: {
      width: "30%",
      height: 80,
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "solid",
    },
    separator: {
      width: "100%",
      height: 1,
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "solid",
    },
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="/28d74124c3365e8a66a995661eaa8724.png"
            style={{ width: 65, height: 65 }}
          />
          <View style={{ textAlign: "center", width: "35%" }}>
            <Text style={styles.headerText}>Republic of the Philippines</Text>
            <Text style={styles.headerText}>Province of Albay</Text>
            <Text style={styles.headerText}>Municipality of Polangui</Text>
          </View>
          <Image
            src="/296302043_2923531537952604_3500277328461748000_n.jpg"
            style={{ width: 70, height: 70 }}
          />
        </View>
        <View style={styles.separator}></View>

        <Text style={styles.subtitle}>OFFICE OF THE BARANGAY CAPTAIN</Text>
        <Text style={styles.title}>BARANGAY BLOTTER</Text>

        {/* <Text style={styles.body}>TO WHOM IT MAY CONCERN:</Text> */}
        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>Case No.: </Text>
          <Text style={{ fontSize: 12 }}>
            {props.data.case_no ? props.data.case_no : ""}
          </Text>
        </View>
        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>Reported Date: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.date_reported}</Text>
        </View>
        <View
          style={{ marginBottom: 30, display: "flex", flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>Reported Time: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.time_reported}</Text>
        </View>

        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>What: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.what}</Text>
        </View>
        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>Where: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.where}</Text>
        </View>
        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>When: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.when}</Text>
        </View>
        <View
          style={{ display: "flex", marginBottom: 30, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>Why: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.why}</Text>
        </View>
        <View
          style={{ display: "flex", marginBottom: 10, flexDirection: "row" }}
        >
          <Text style={{ fontSize: 12 }}>How: </Text>
          <Text style={{ fontSize: 12 }}>{props.data.how}</Text>
        </View>

        <Image
          src="/28d74124c3365e8a66a995661eaa8724.png"
          style={styles.watermark}
        />

        <View style={styles.signatureSection}>
          <View
            style={{
              width: "45%",
              fontSize: 12,
              marginTop: 18,
              textAlign: "center",
            }}
          >
            <Text style={{ textAlign: "left" }}>Reported By:</Text>
            <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
              {props.data.complainant}
            </Text>
            <Text>Complainant</Text>
          </View>
          <View style={{ ...styles.signatureBox, marginTop: 80 }}>
            {/* <Text style={{ marginLeft: 16 }}>Approved By:</Text> */}
            <View style={{ textAlign: "center", marginTop: 5 }}>
              <Text style={{ textAlign: "left" }}>Recorded By:</Text>
              <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
                {props.barangaySecretary.full_name}
              </Text>
              <Text>Barangay Secretary</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.footerSection}>
          <View style={{ width: "45%" }}>
            <Text>CTC No.: _______________ </Text>
            <Text>ISSUED at: ______________</Text>
            <Text>ISSUED on: ______________ </Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text style={{ marginLeft: 16 }}>Issued By:</Text>
            <View style={{ textAlign: "center", marginTop: 5 }}>
              <Text>____________________________________</Text>
              <Text>Barangay Secretary</Text>
            </View>
          </View>
        </View> */}

        {/* <View style={styles.twoBoxSection}>
          <View style={styles.box} />
          <View style={styles.box} />
        </View> */}
      </Page>
    </Document>
  );
};

export default BlotterReportPdf;
