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
import { format } from "date-fns";
import { BrgyClearance, DocDetails } from "@/app/pdf/[id]/page";
import { BarangayOfficial } from "@/utils/firebaseUtils";

type Props = {
  data: DocDetails;
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
};

const formatWithOrdinal = (date: Date): string => {
  const day = format(date, "d");
  const dayNumber = parseInt(day, 10);
  const suffix =
    dayNumber % 10 === 1 && dayNumber !== 11
      ? "st"
      : dayNumber % 10 === 2 && dayNumber !== 12
      ? "nd"
      : dayNumber % 10 === 3 && dayNumber !== 13
      ? "rd"
      : "th";
  return `${day}${suffix}`;
};

const BarangayClearancePDF = (props: Props) => {
  const { data }: { data: DocDetails } = props;

  const clearanceDetails = props.data.details as BrgyClearance;

  const today = new Date();
  const formattedDate = `${formatWithOrdinal(today)} day of ${format(
    today,
    "MMMM, yyyy"
  )}`;

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
        <Text style={styles.title}>BARANGAY CLEARANCE</Text>

        <Text style={styles.body}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.paragraph}>
          This is to certify that{" "}
          <Text style={{ fontWeight: "bold" }}>{data.full_name}</Text>, of legal
          age, {clearanceDetails.gender.toLocaleLowerCase()},{" "}
          {clearanceDetails.civil_status.toLocaleLowerCase()}, and a bonafide
          resident of Zone {clearanceDetails.zone}, San Roque, Polangui, Albay.
        </Text>

        <Text style={styles.paragraph}>
          Further CERTIFY that{" "}
          {clearanceDetails.gender.toLocaleLowerCase() == "male" ? "he" : "she"}{" "}
          is known to me of good moral character and is a law abiding citizen.
          {clearanceDetails.gender.toLocaleLowerCase() == "male"
            ? "He"
            : "She"}{" "}
          has no pending case nor derogatory record in this Barangay.
        </Text>

        <Text style={styles.paragraph}>
          This certification is being issued upon the request of the
          above-mentioned name, for the purpose of {clearanceDetails.purpose}{" "}
          and for whatever purpose/s it may serve.
        </Text>

        <Text style={styles.paragraph}>
          Issued this {formattedDate} at Barangay San Roque, Polangui, Albay.
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
            <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
              {data.full_name}
            </Text>
            <Text>Bearer Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Approved By:</Text>
            <View
              style={{
                textAlign: "center",
                marginTop: 5,
              }}
            >
              <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
                {props.barangayCaptain.full_name}
              </Text>
              <Text>Barangay Captain</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <View style={{ width: "45%" }}>
            <Text>
              CTC No.:{" "}
              {clearanceDetails.ctc_no
                ? clearanceDetails.ctc_no
                : "_______________"}
            </Text>
            <Text>
              ISSUED at:{" "}
              {clearanceDetails.ctc_issued_at
                ? clearanceDetails.ctc_issued_at
                : "_______________"}
            </Text>
            <Text>
              ISSUED on:{" "}
              {clearanceDetails.ctc_issued_on
                ? format(
                    new Date(clearanceDetails.ctc_issued_on),
                    "MMMM dd, yyyy"
                  )
                : "_______________"}{" "}
            </Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text>Issued By:</Text>
            <View style={{ textAlign: "center", marginTop: 5 }}>
              <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
                {props.barangaySecretary.full_name}
              </Text>
              <Text>Barangay Secretary</Text>
            </View>
          </View>
        </View>

        <View style={styles.twoBoxSection}>
          <View style={styles.box} />
          <View style={styles.box} />
        </View>
      </Page>
    </Document>
  );
};

export default BarangayClearancePDF;
