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

const BarangayIndigency = (props: Props) => {
  // Register the font
  Font.register({
    family: "Times New Roman",
    src: "/Times New Roman.ttf", // Update this path to where you store your font files
    fontStyle: "normal",
    fontWeight: "normal",
  });

  Font.register({
    family: "Times New Roman",
    src: "/Times New Roman.ttf", // Update this path to where you store your font files
    fontStyle: "normal",
    fontWeight: "bold",
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
        <Text style={styles.title}>CERTIFICATE OF INDIGENCY</Text>

        <Text style={styles.body}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.paragraph}>
          This is to certify that _____, male/female, married/single, of legal
          age, Filipino citizen and a resident of this barangay, belongs to the
          Indigent Families of this barangay.
        </Text>

        <Text style={styles.paragraph}>
          Further CERTIFY that he/she is known to me of good moral character and
          is a law abiding citizen. He/she has no pending case nor derogatory
          record in this Barangay.
        </Text>

        <Text style={styles.paragraph}>
          This CERTIFICATION is issued upon the request of the above-mentioned
          individual for whatever legal purpose/s it may best serve him or her.
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

export default BarangayIndigency;
