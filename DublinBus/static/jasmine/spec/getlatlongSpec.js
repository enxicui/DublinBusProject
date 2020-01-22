
describe("Request", function() {
    let jsonObject = null;

    // Before each test is done getJsonObj must be completed and it's
    // returned Promise must be resolved. 
    // Variable jsonObject is set to the Promise's value 

    beforeEach(async function(done) {
        await getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland').then((jsonObj) => {
            console.log("JSON String Parsed");
            jsonObject = jsonObj;
            console.log("jsonObject", jsonObj)
        }, function(error) {
            console.log(error);
        });
        done();
    });


    it("JSON Object should have property 'Res'", function(done) {
        var actual = Object.keys(jsonObject).sort();
        console.log("actual", actual);
        var expected = [
            'Res'
            ].sort();

        expect(actual).toEqual(expected);
        done();
    });

    it("JSON Object should have latitude of", function(done) {
        expect(jsonObject.Res["Addr"]["y"]).toBe(53.200903);
        done();
    });

});

