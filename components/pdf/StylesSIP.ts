import { StyleSheet } from "@react-pdf/renderer";

export const StylesSIP = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 72,
    paddingRight: 72,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.2,
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  logoBox: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  kopSuratContainer: {
    flexGrow: 1,
    textAlign: "center",
    alignItems: "center",
  },

  kop1: {
    fontSize: 12.5,
    fontWeight: 500,
    textAlign: "center",
  },

  kop1Bold: {
    fontSize: 12.5,
    fontWeight: 700,
    textAlign: "center",
  },

  kop3: {
    fontSize: 8,
    marginTop: 2,
    textAlign: "center",
  },

  headerLine: {
    height: 1.5,
    backgroundColor: "#000",
    marginTop: 2,
    marginBottom: 5,
    width: "100%",
  },

  // TITLE
  title: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 10,
  },

  diizinkan: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 700,
    marginTop: 10,
  },
  
  // FORM 1 & 2
  text: {
    marginTop: 10,
  },

  form: {
    paddingLeft: 30,
    marginTop: 5,
    marginBottom: 10,
  },

  infoLabel: {
    width: "35%",   
    fontSize: 11,
    marginBottom: 2,
  },

  infoColon: {
    width: "3%",   
    fontSize: 11,
    marginBottom: 2,
  },

  infoValue: {
    width: "62%",  
    fontSize: 11,
    marginBottom: 2,
  },
  
  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },

  // KETENTUAN
  ketentuancont: {
    marginTop: 10,
    marginBottom: 10,
  },

  ketentuantitle: {
    fontSize: 11,
    marginBottom: 2,
  }, 

  listRow: {
  flexDirection: "row",
  marginBottom: 2,
  },

  listNumber: {
    width: 15,          
    fontSize: 11,
  },

  listText: {
    flex: 1,
    fontSize: 11,
    textAlign: "justify",
  },

  // TANGGAL TTD
  tanggalRight: {
    textAlign: "center",
    fontSize: 10,
    width: "45%",      
    marginLeft: "55%", 
  },

  // TANDA TANGAN
  ttdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  ttdCol: {
    width: "45%",
    textAlign: "center",
    fontSize: 10,
  },

  ttdMengetahui: {
    marginTop: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
  },

  ttdSpace: {
    height: 60,
  },
});