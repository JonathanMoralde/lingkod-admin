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

type Props = {};

const EventPermitPdf = (props: Props) => {
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
        <Text style={styles.title}>
          BARANGAY PERMIT TO HOLD SOCIAL GATHERING
        </Text>

        {/* <Text style={styles.body}>TO WHOM IT MAY CONCERN:</Text> */}

        <Text style={styles.paragraph}>
          This is to certify that _______________ has requested permission to
          hold a _________________ with the following details:
        </Text>

        <View style={{ fontSize: 12, marginVertical: 5 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <View style={{ width: "50%" }}>
              <Text>Date: __________</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text>Time: __________</Text>
            </View>
          </View>
          <Text style={{ marginBottom: 5 }}>Place/Venue: ___________</Text>
          <Text>No. of Guest: ___________</Text>
        </View>

        {/* <Text style={styles.paragraph}>
          Further CERTIFY that he/she is known to me of good moral character and
          is a law abiding citizen. He/she has no pending case nor derogatory
          record in this Barangay.
        </Text> */}

        <Text style={styles.paragraph}>
          After checking the venue and certifying that it can accommodate the
          guests. _____________ is granted permission to hold this event as
          he/she/they promised to abide by the health and safety protocols set
          by the IATF and the Municipality of Polangui regarding the holding of
          social gatherings.
        </Text>

        <Text style={styles.paragraph}>
          Issued this ___ day of _____ at Barangay San Roque, Polangui, Albay.
        </Text>

        {/* <Text style={styles.watermark}>Barangay Logo</Text> */}
        <Image
          src="/28d74124c3365e8a66a995661eaa8724.png"
          style={styles.watermark}
        />

        <View style={styles.signatureSection}>
          <View
            style={{
              width: "45%",
              textAlign: "center",
              fontSize: 12,
              marginTop: 18,
            }}
          >
            {/* <Text>____________________________________</Text>
            <Text>Bearer Signature</Text> */}
          </View>
          <View style={styles.signatureBox}>
            {/* <Text style={{ marginLeft: 16 }}>Approved By:</Text> */}
            <View style={{ textAlign: "center", marginTop: 5 }}>
              <Text>____________________________________</Text>
              <Text>Barangay Captain</Text>
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

export default EventPermitPdf;
