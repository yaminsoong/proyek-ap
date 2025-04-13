// inport excel view data masih berantakan ga rapih

import React, { useState } from "react";
import { View, Button, ScrollView, ActivityIndicator, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as XLSX from "xlsx";
import { DataTable, Text } from "react-native-paper";
import { LineChart, Grid } from "react-native-svg-charts";

const ExcelViewer = () => {
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [scurveData, setScurveData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    setLoading(true);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (res.canceled) {
        setLoading(false);
        return;
      }

      const file = await fetch(res.assets[0].uri);
      const blob = await file.blob();

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

        const sheetName = workbook.SheetNames.find((name) => name.includes("S-CURVE")) || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length === 0) {
          Alert.alert("File Kosong", "File Excel tidak memiliki data.");
          setLoading(false);
          return;
        }

        setTableHead(jsonData[0] || []);
        const rawData = jsonData.slice(1) || [];
        setTableData(rawData);

        const progressData = rawData.map((row) => parseFloat(row[3]) || 0);
        setScurveData(progressData);

        setLoading(false);
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Pilih File Excel" onPress={pickDocument} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <ScrollView horizontal>
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              {tableHead.map((head, index) => (
                <DataTable.Title key={index}>{head}</DataTable.Title>
              ))}
            </DataTable.Header>
            {tableData.map((row, rowIndex) => (
              <DataTable.Row key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <DataTable.Cell key={cellIndex}>
                    <Text>{cell}</Text>
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      </ScrollView>

      {/* S-Curve Chart */}
      {scurveData.length > 0 && (
        <LineChart
          style={{ height: 200, width: 300 }}
          data={scurveData}
          svg={{ stroke: "rgb(134, 65, 244)" }}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Grid />
        </LineChart>
      )}
    </View>
  );
};

export default ExcelViewer;
