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
import {
  BrgyClearance,
  BrgyIndigency,
  BusinessPermit,
  DocDetails,
  EventPermit,
} from "@/app/pdf/actions";
import { BarangayOfficial } from "@/app/pdf/actions";

import { format } from "date-fns";
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

type Props = {
  data: DocDetails;
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
};

const BusinessPermitPdf = (props: Props) => {
  const { data }: { data: DocDetails } = props;

  const businessPermitDetails = props.data.details as BusinessPermit;

  const today = new Date();
  const formattedDate = `${formatWithOrdinal(today)} day of ${format(
    today,
    "MMMM, yyyy"
  )}`;

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
      marginVertical: 40,
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

        <Text style={styles.title}>BARANGAY BUSINESS PERMIT</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          <View style={{ marginRight: 30 }}>
            {/* left */}
            <Text style={{ marginBottom: 20 }}>Nature of Business: </Text>
            <Text>Proprietor:</Text>
            <Text>Permit Number:</Text>
            <Text>Address:</Text>
            <Text>Business Location:</Text>
            <Text>Status:</Text>
          </View>

          <View style={{ marginRight: 30, maxWidth: "50%" }}>
            {/* middle */}
            <Text style={{ marginBottom: 20 }}>
              {businessPermitDetails.nature_of_business}
            </Text>
            <Text>{businessPermitDetails.proprietor}</Text>
            <Text>{businessPermitDetails.permit_no}</Text>
            <Text>{businessPermitDetails.address}</Text>
            <Text>{businessPermitDetails.business_location}</Text>
            <Text>{businessPermitDetails.status}</Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* right */}
            <Text>
              Valid until:{" "}
              {format(
                new Date(businessPermitDetails.valid_until),
                "MMMM dd, yyyy"
              )}
            </Text>
            <Text>Amount Paid: {businessPermitDetails.amount_paid} PHP</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          This Permit is being issued subject to existing rules and regulations,
          provided however, that the necessary fees are paid to the Treasurer of
          the Barangay as assessed.
        </Text>

        <Text style={styles.paragraph}>
          This is non-transferable and shall be deemed null and void upon
          failure by the owner to follow said rules and regulations set forth by
          the Local Government Unit of Polangui, Albay.
        </Text>

        <Text style={styles.paragraph}>
          GIVEN this {formattedDate} at Barangay San Roque, Polangui, Albay.
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
              marginTop: 50,
            }}
          >
            <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
              {data.full_name}
            </Text>
            <Text>Owner</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={{ textAlign: "center", marginTop: 5 }}>
              <Text style={{ width: "100%", borderBottom: "1px solid black" }}>
                {props.barangayCaptain.full_name}
              </Text>
              <Text>Barangay Captain</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <View style={{ width: "45%" }}>
            <Text>CTC No.: _______________ </Text>
            <Text>ISSUED at: ______________</Text>
            <Text>ISSUED on: ______________ </Text>
            <Text>OR No.: _______________ </Text>
            <Text>ISSUED on: ______________ </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontFamily: "Times New Roman",
              fontStyle: "italic",
              fontSize: 10,
            }}
          >
            {`(This License, while in force, shall be posted in a conspicuous place in the business premises.)`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BusinessPermitPdf;
