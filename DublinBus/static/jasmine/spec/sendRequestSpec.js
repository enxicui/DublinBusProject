describe("testing sendRequestSpec", function() {
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var sampletest = new getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');

    it("tests that geocoder objects are created", function() {
    console.log("testobject", testobject)
    expect(geocoder, geocoder2).toEqual(testobject);
    });
})