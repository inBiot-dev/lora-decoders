# Decoder for MICA - LoRaWAN versions from 1.0 to 2.1

## Mica LoRa messages

Three tipe of messges are possible.

### Configuration message:

Information about the frequency of data upload, the type of ventilation and the status of the LED will appear in the configuration payload.

> [!NOTE]
> Led and ventilation type can be configured from the APP.

| Data         | Bytes position | Description                                                                                                                                                             |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message Type | 0              | This value refers to the type of message that is being sent. It can have the following values: <br> 0 = mica configuration <br> 1 = mica data <br> 2 = mica information |
| Time to send | 1              | Time between send data                                                                                                                                                  |
| Ventilation  | 2              | Type of ventilation in the room                                                                                                                                         |
| ledStatus    | 3              | Led status (On or Off)                                                                                                                                                  |

### Information Message

This payload will contain all the data regarding the MICA information, including the MAC, version, model, type of mica, and information for the modbus configuration.

> [!NOTE]
> Modbus values can be configured from the APP.

| Data             | Bytes position | Description                                                                                                                                                                                                                                                                                               |
| ---------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message Type     | 0              | This value refers to the type of message that is being sent. It can have the following values: <br> 0 = mica configuration <br> 1 = mica data <br> 2 = mica information                                                                                                                                   |
| Firmware version | 1-3            | Text string with the device firmware version.                                                                                                                                                                                                                                                             |
| MICA model       | 4-20           | 17-character text string with the MICA model                                                                                                                                                                                                                                                              |
| MICA type        | 21-29          | MICA type (MINI, MICA, PLUS, WELL)                                                                                                                                                                                                                                                                        |
| MAC              | 30-35          | MICAs MAC                                                                                                                                                                                                                                                                                                 |
| Modbus address   | 36             | Modbus address (0-254)                                                                                                                                                                                                                                                                                    |
| Parity           | 37             | Different options of parity (0-5) <br> 0: SERIAL_8N1 (No parity, 1 stop bit) <br> 1: SERIAL_8N2 (No parity, 2 stop bit) <br> 2: SERIAL_8E1 (Even parity, 1 stop bit) <br> 3: SERIAL_8E2 (Even parity, 2 stop bit) <br> 4: SERIAL_8O1 (Odd parity, 1 stop bit) <br> 5: SERIAL_8O2 (Odd parity, 2 stop bit) |
| Baud Rate        | 38-41          | Modbus connection baud rate (default 9600)                                                                                                                                                                                                                                                                |

### Data messages

The data is ordered as follows in the message

| Data              | Value     | Bytes position | Description                                                                                                                                                             |
| ----------------- | --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message Type      | 0-2       | 0              | This value refers to the type of message that is being sent. It can have the following values: <br> 0 = mica configuration <br> 1 = mica data <br> 2 = mica information |
| Temperature       | 0.0-145.0 | 1-2            | Temperature value in degrees. Divide the value by 10 to obtain the decimal.                                                                                             |
| Humidity          | 0-100.0   | 3-4            | Humidity value in percentage. Divide the value by 10 to get the decimal.                                                                                                |
| CO2               | 0-10000   | 5-6            | CO2 value in ppm                                                                                                                                                        |
| CH2O              | 0-5000    | 7-8            | Formaldehyde value in µg/m³                                                                                                                                             |
| TVOC (index)      | 0-500     | 9-10           | TVOC value in ppb                                                                                                                                                       |
| PM1_0             | 0-10000   | 11-12          | PM1.0 value in µg/m³                                                                                                                                                    |
| PM2_5             | 0-10000   | 13-14          | PM2.5 value in µg/m³                                                                                                                                                    |
| PM4_0             | 0-10000   | 15-16          | PM4.0 value in µg/m³                                                                                                                                                    |
| PM10              | 0-10000   | 17-18          | PM10 value in µg/m³                                                                                                                                                     |
| O3                | 0-5000    | 19-20          | **Model WELL exclusive** <br> Ozone value in ppb                                                                                                                        |
| NO2               | 0-2500    | 21-22          | **Model WELL exclusive** <br> NO2 value in ppb                                                                                                                          |
| CO                | 0-1000    | 23-24          | **Model WELL exclusive** <br> CO value in ppm                                                                                                                           |
| Counter           | 0-65535   | 25-26          | Counter to know if any packet has been lost.                                                                                                                            |
| MICA type         |           | 27-31          | MICA type (MINI, MICA, PLUS, WELL)                                                                                                                                      |
| Ventilation Index | 100-0     | 32             | Index value in percentage <br> 100%-84% = Excelent <br> 84%-66% = Good <br> 65%-49% = Moderate <br> 48%-33% = Regular <br> 32%-17% = Inadequate <br> 16%-0% = Poor      |

> [!NOTE]
> More information about Ventilation index could be found [here](https://www.inbiot.es/wikinbiot/indicador-eficacia-ventilacion)

> [!IMPORTANT]
> All sensor measurements correspond to 2-byte integer values.

The values provided by the decoder will correspond to those of the sensor integrated into your model.
