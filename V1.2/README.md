# Decoder for MICA - LoRaWAN versions from 2.1 to last

## MICA LoRa messages

Three type of messages are possible.

### Configuration message:

Information about the frequency of data upload, the type of ventilation and the status of the LED will appear in the configuration payload.

> [!NOTE]
> LED (on/off) and ventilation type can be configured from the APP.

| Attribute name         | Attribute key | Description                                                                                                                                                             |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Time to send | timeInterval              | Time (in minutes) between each sending of measurements. <br> Default value = 10 minutes.                                                                                                                                               |
| Type of ventilation  | ventilation              | Type of ventilation in the room. This is used for the auto-calibration cycle of the CO₂ sensor.  <br> Possible values: <br> 1 = 'Daily natural ventilation'  <br> 2 = 'Mechanical forced ventilation' <br> 3 = 'Low ventilation' <br> 4 = 'No ventilation' <br> 5 = 'Calibration off'                                                                                                                                  |
| LED status    | ledStatus              | Led status (On or Off). <br> Default value = true                                                                                                                                                  |
| Use WiFi instead | useWifi | Whether to use WiFi instead of LoRaWAN. <br> Default value = false. |
| LoRaWAN Region | lorawanRegion | The LoRaWAN region. |
| LoRaWAN Channel Mask | lorawanChannelMask | The LoRaWAN channel mask. |

### Information Message

This payload will contain all the MICA information, including the MAC, version, model, type of mica, and information for the Modbus configuration (only in Modbus versions).

> [!NOTE]
> Modbus values can be configured from the APP.

| Attribute name         | Attribute key | Description                                                                                                                                                             |
| ---------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firmware version | fwVersion            | Text string with the device firmware version.                                                                                                                                                                                                                                                             |
| MICA model       | model           | 17-character text string with the MICA model                                                                                                                                                                                                                                                              |
| MICA type        | micaType          | MICA type (MINI, MICA, PLUS, WELL)                                                                                                                                                                                                                                                                        |
| MAC Address            | mac          | Device's MAC                                                                                                                                                                                                                                                                                                 |
| Reset Reason | resetReason | The reason for the last device reset. |

> [!NOTE]
> Modbus values only available in Modbus models.

| Attribute name         | Attribute key | Description                                                                                                                                                             |
| ---------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modbus address   | modbusAddress             | Modbus slave address (0-254). <br> Default value = 1.                                                                                                                                                                                                                                                                                  |
| Modbus parity           | modbusParity             | Different options of parity (0-5). <br> Default value = 0. <br> <br> 0: SERIAL_8N1 (No parity, 1 stop bit) <br> 1: SERIAL_8N2 (No parity, 2 stop bit) <br> 2: SERIAL_8E1 (Even parity, 1 stop bit) <br> 3: SERIAL_8E2 (Even parity, 2 stop bit) <br> 4: SERIAL_8O1 (Odd parity, 1 stop bit) <br> 5: SERIAL_8O2 (Odd parity, 2 stop bit) |
| Modbus baudrate        | modbusBaudRate          | Modbus connection baud rate. <br> Default value = 9600                                                                                                                                                                                                                                                               |

### IAQ Data messages

The indoor air quality (IAQ) data is organized as follows in the message

| Attribute name              | Attribute key     | Range | Description                                                                                                                                                             |
| ----------------- | --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Temperature       | temperature | 0.0-145.0ºC            | Temperature value in ºC. <br> <a href="https://www.inbiot.es/wikinbiot/temperature"><img src="https://img.shields.io/badge/Temperature information-blue?style=for-the-badge" alt="Link"/></a>                                                                                           |
| Humidity          | humidity   | 0-100.0%            | Humidity value in %. <br> <a href="https://www.inbiot.es/wikinbiot/relative-humidity"><img src="https://img.shields.io/badge/Humidity information-blue?style=for-the-badge" alt="Link"/></a>                                                                                               |
| CO₂               | co2  | 0-10000 ppm            | CO₂ value in ppm <br> <a href="https://www.inbiot.es/wikinbiot/co2"><img src="https://img.shields.io/badge/CO₂ information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                        |
| CH2O              | ch20    | 0-5000 µg/m³             | Formaldehyde value in µg/m³ <br> <a href="https://www.inbiot.es/wikinbiot/formaldehyde"><img src="https://img.shields.io/badge/Formaldehyde information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                            |
| TVOC (Total Volatile Organic Compounds)      | tvoc     | 0-500           | TVOC value in index value <br> <a href="https://www.inbiot.es/wikinbiot/tvoc"><img src="https://img.shields.io/badge/TVOC information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                       |
| PM1_0             | pm1_0   |   0-10000 µg/m³        | PM1.0 value in µg/m³ <br> <a href="https://www.inbiot.es/wikinbiot/particulate-matter"><img src="https://img.shields.io/badge/Particulate matter information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                   |
| PM2_5             | pm2_5   | 0-10000 µg/m³          | PM2.5 value in µg/m³ <br> <a href="https://www.inbiot.es/wikinbiot/particulate-matter"><img src="https://img.shields.io/badge/Particulate matter information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                     |
| PM4_0             | pm4   | 0-10000 µg/m³          | PM4.0 value in µg/m³ <br> <a href="https://www.inbiot.es/wikinbiot/particulate-matter"><img src="https://img.shields.io/badge/Particulate matter information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                   |
| PM10              | pm10   | 0-10000 µg/m³          | PM10 value in µg/m³ <br> <a href="https://www.inbiot.es/wikinbiot/particulate-matter"><img src="https://img.shields.io/badge/Particulate matter information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                                                     |
| O₃                |  o3   | 0-5000 ppb          | **Model WELL exclusive** <br> Ozone value in ppb <br> <a href="https://www.inbiot.es/wikinbiot/ozone"><img src="https://img.shields.io/badge/O₃ information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                       |
| NO₂               |  no2   | 0-2500 ppb          | **Model WELL exclusive** <br> NO₂ value in ppb <br> <a href="https://www.inbiot.es/wikinbiot/nitrogen-dioxide"><img src="https://img.shields.io/badge/NO₂ information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                        |
| CO                | co    | 0-1000 ppm          | **Model WELL exclusive** <br> CO value in ppm <br> <a href="https://www.inbiot.es/wikinbiot/carbon-monoxide"><img src="https://img.shields.io/badge/CO information-blue?style=for-the-badge" alt="Link"/></a>                                                                                                                          |
| Ventilation Index | vIndex     | 100-0            | Index value in percentage <br> <a href="https://www.inbiot.es/wikinbiot/indicador-eficacia-ventilacion"><img src="https://img.shields.io/badge/Ventilation Efficiency Indicator Info-blue?style=for-the-badge" alt="Link"/></a>     |
| Thermal Index | tIndex | 0-100 | Thermal comfort index. <br> <a href="https://www.inbiot.es/wikinbiot/indicador-confort-termohigrometrico"><img src="https://img.shields.io/badge/Thermohygrometric Comfort Indicator Info-blue?style=for-the-badge" alt="Link"/></a> |
| Virus Index | virusIndex | 0-100 | Virus risk index. <br> <a href="https://www.inbiot.es/wikinbiot/indicador-resistencia-virus"><img src="https://img.shields.io/badge/Virus Spread Resistance Indicator Info-blue?style=for-the-badge" alt="Link"/></a> |
| IAQ Index | iaqIndex | 0-100 | Indoor air quality index. <br> <a href="https://www.inbiot.es/wikinbiot/indicador-calidad-de-aire-interior"><img src="https://img.shields.io/badge/Indoor Air Quality Indicator Info-blue?style=for-the-badge" alt="Link"/></a> |
| Counter           | counter   | 0-65535          | Counter to know if any packet has been lost.                                                                                                                            |
| MICA type         |  type         |           | MICA type (MINI, MICA, PLUS, WELL)                                                                                                                                      |

> [!IMPORTANT]
> All sensor measurements correspond to 2-byte integer values.

The values provided by the decoder will correspond to those of the sensor integrated into your model.