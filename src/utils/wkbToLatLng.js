export const parseWKBHexToLatLng = (hex) => {
  // Handle null, undefined, or non-string values
  if (!hex || typeof hex !== "string") {
    return null;
  }

  try {
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g).map((b) => parseInt(b, 16))
    );
    const view = new DataView(bytes.buffer);

    const lng = view.getFloat64(9, true); // skip 0–8 (header + SRID)
    const lat = view.getFloat64(17, true);

    return { lat, lng };
  } catch (error) {
    console.error("Error parsing WKB hex:", error);
    return null;
  }
};
