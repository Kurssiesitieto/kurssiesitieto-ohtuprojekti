class HelsinkiInterface {
  /*
    MOCK Interface to communicate with helsinki.fi APIs.

    Methods:
    degreeStructure - Gets degree structure using degree code
    */

  constructor() {
    // TKT kanditutkinnon hy-lv-74 perusopinnot eduviewer apin rakenteen tyyliin.
    this.degree = JSON.parse(`{
            "id": "hy-EDU-114256325-2017",
            "code": "KM-TIETOJENK-KOUL",
            "name": {
                "en": "Bachelor's Programme in Computer Science and Master's Programme (3 years + 2 years)",
                "fi": "Tietojenkäsittelytieteen kandiohjelma ja maisteriohjelma (3v + 2v)",
                "sv": "Kandidatprogrammet i datavetenskap och magisterprogram (3 år + 2 år)"
            },
            "type": "Education",
            "groupId": "hy-EDU-114256325",
            "dataNode": {
                "id": "otm-5cd5c961-a961-4bd9-a067-61a4baf61d2c",
                "code": "KH50_005",
                "name": {
                    "en": "Bachelor's Programme in Computer Science",
                    "fi": "Tietojenkäsittelytieteen kandiohjelma",
                    "sv": "Kandidatprogrammet i datavetenskap"
                },
                "rule": {
                    "rule": {
                        "type": "CompositeRule",
                        "rules": [
                            {
                                "type": "CompositeRule",
                                "rules": [
                                    {
                                        "type": "ModuleRule",
                                        "localId": "e62f1917-314b-48e9-8fa4-20a329eeba74",
                                        "moduleGroupId": "hy-SM-118024353",
                                        "dataNode": {
                                            "id": "otm-1137460d-48c7-474c-9665-bd9bda6a5b96",
                                            "code": "TKT1",
                                            "name": {
                                                "en": "Computer Science, Basic Studies",
                                                "fi": "Tietojenkäsittelytiede, perusopinnot",
                                                "sv": "Datavetenskap, grundstudier"
                                            },
                                            "rule": {
                                                "type": "CompositeRule",
                                                "rules": [
                                                    {
                                                        "type": "ModuleRule",
                                                        "localId": "3a54d070-e31a-43a2-bd77-fa72257348f9",
                                                        "moduleGroupId": "otm-857173af-25dd-4404-bfcc-45c518332d01",
                                                        "dataNode": {
                                                            "id": "otm-857173af-25dd-4404-bfcc-45c518332d01",
                                                            "code": null,
                                                            "name": {
                                                                "en": "Elective basic studies or intermediate studies",
                                                                "fi": "Valinnaisia perusopintoja tai aineopintoja",
                                                                "sv": "Valfria grundstudier eller ämnesstudier"
                                                            },
                                                            "rule": {
                                                                "rule": {
                                                                    "type": "CompositeRule",
                                                                    "rules": [
                                                                        {
                                                                            "type": "AnyCourseUnitRule",
                                                                            "localId": "a30acf9b-d0fc-40b9-8f5f-5b7aaaf21848",
                                                                            "dataNode": {
                                                                                "name": "anyCourseUnitRule"
                                                                            }
                                                                        }
                                                                    ],
                                                                    "localId": "a6afeec7-d17c-4331-9209-163c91d0d211",
                                                                    "require": {
                                                                        "max": null,
                                                                        "min": 0
                                                                    },
                                                                    "description": {
                                                                        "en": "Voit lisätä tähän valinnaisia perus- tai aineopintoja, mikäli kokonaisuuden minimilaajuus (25 op) ei muuten täyty.",
                                                                        "fi": "<p>Voit lisätä tähän valinnaisia perus- tai aineopintoja, mikäli kokonaisuuden minimilaajuus (25 op) ei muuten täyty.</p>",
                                                                        "sv": "Voit lisätä tähän valinnaisia perus- tai aineopintoja, mikäli kokonaisuuden minimilaajuus (25 op) ei muuten täyty."
                                                                    },
                                                                    "allMandatory": false
                                                                },
                                                                "type": "CreditsRule",
                                                                "credits": {
                                                                    "max": null,
                                                                    "min": 0
                                                                },
                                                                "localId": "0e4de733-db98-479e-a97a-1e8b1ae1c714"
                                                            },
                                                            "type": "GroupingModule",
                                                            "groupId": "otm-857173af-25dd-4404-bfcc-45c518332d01"
                                                        }
                                                    },
                                                    {
                                                        "type": "CourseUnitRule",
                                                        "localId": "04ec66a6-beb0-4d18-9695-4f6d57816879",
                                                        "courseUnitGroupId": "hy-CU-118023867",
                                                        "dataNode": {
                                                            "id": "otm-0d82da83-b28a-40f0-a5d8-868e9fa8c2b8",
                                                            "code": "TKT10002",
                                                            "name": {
                                                                "en": "Introduction to Programming",
                                                                "fi": "Ohjelmoinnin perusteet",
                                                                "sv": "Introduktion till programmering"
                                                            },
                                                            "credits": {
                                                                "max": 5,
                                                                "min": 5
                                                            },
                                                            "groupId": "hy-CU-118023867",
                                                            "gradeScaleId": "sis-0-5"
                                                        }
                                                    },
                                                    {
                                                        "type": "CourseUnitRule",
                                                        "localId": "7ad9b744-7892-4706-91a4-799392904c39",
                                                        "courseUnitGroupId": "hy-CU-118023947",
                                                        "dataNode": {
                                                            "id": "otm-eb0cf926-57aa-4c8e-9ddc-8b6611930674",
                                                            "code": "TKT10003",
                                                            "name": {
                                                                "en": "Advanced Course in Programming",
                                                                "fi": "Ohjelmoinnin jatkokurssi",
                                                                "sv": "Fortsättningskurs i programmering"
                                                            },
                                                            "credits": {
                                                                "max": 5,
                                                                "min": 5
                                                            },
                                                            "groupId": "hy-CU-118023947",
                                                            "gradeScaleId": "sis-0-5"
                                                        }
                                                    },
                                                    {
                                                        "type": "CourseUnitRule",
                                                        "localId": "8f8e5099-6f4f-4ff2-b285-bf84e010cfa3",
                                                        "courseUnitGroupId": "hy-CU-118023990",
                                                        "dataNode": {
                                                            "id": "otm-5b525260-b775-4578-81ac-5e3ba347e893",
                                                            "code": "TKT10004",
                                                            "name": {
                                                                "en": "Introduction to Databases",
                                                                "fi": "Tietokantojen perusteet",
                                                                "sv": "Databasernas grunder"
                                                            },
                                                            "credits": {
                                                                "max": 5,
                                                                "min": 5
                                                            },
                                                            "groupId": "hy-CU-118023990",
                                                            "gradeScaleId": "sis-0-5"
                                                        }
                                                    },
                                                    {
                                                        "type": "CourseUnitRule",
                                                        "localId": "otm-66ecd418-11e0-49e0-bf33-eefedf7b4eff",
                                                        "courseUnitGroupId": "otm-e4cbe2b1-12be-49ca-92ce-9aeead0759f3",
                                                        "dataNode": {
                                                            "id": "otm-e4cbe2b1-12be-49ca-92ce-9aeead0759f3",
                                                            "code": "TKT10006",
                                                            "name": {
                                                                "en": "Computer and Internet",
                                                                "fi": "Tietokone ja Internet",
                                                                "sv": "Dator och Internet"
                                                            },
                                                            "credits": {
                                                                "max": 5,
                                                                "min": 5
                                                            },
                                                            "groupId": "otm-e4cbe2b1-12be-49ca-92ce-9aeead0759f3",
                                                            "gradeScaleId": "sis-0-5"
                                                        }
                                                    },
                                                    {
                                                        "type": "CourseUnitRule",
                                                        "localId": "otm-81b2f939-7e28-49e1-ab94-1419eb341da7",
                                                        "courseUnitGroupId": "hy-CU-132986295",
                                                        "dataNode": {
                                                            "id": "otm-f3ca3171-8184-4fd6-8f58-cfdbf68efe4e",
                                                            "code": "TKT200011",
                                                            "name": {
                                                                "en": "Data Structures and Algorithms I",
                                                                "fi": "Tietorakenteet ja algoritmit I",
                                                                "sv": "Datastrukturer och algoritmer I"
                                                            },
                                                            "credits": {
                                                                "max": 5,
                                                                "min": 5
                                                            },
                                                            "groupId": "hy-CU-132986295",
                                                            "gradeScaleId": "sis-0-5"
                                                        }
                                                    }
                                                ],
                                                "localId": "b5d9eed2-384d-40ea-9f9e-6be50e801165",
                                                "require": null,
                                                "description": null,
                                                "allMandatory": true
                                            },
                                            "type": "StudyModule",
                                            "groupId": "hy-SM-118024353",
                                            "gradeScaleId": "sis-0-5",
                                            "targetCredits": {
                                                "max": 25,
                                                "min": 25
                                            }
                                        }
                                    }
                                ],
                                "localId": "ab094371-8a49-4449-99c3-de44d39cc491",
                                "require": null,
                                "description": null,
                                "allMandatory": true
                            }
                        ],
                        "localId": "6c32149c-3785-49fc-bae8-2d4076e659a0",
                        "require": {
                            "max": null,
                            "min": 0
                        },
                        "description": null,
                        "allMandatory": false
                    },
                    "type": "CreditsRule",
                    "credits": {
                        "max": null,
                        "min": 180
                    },
                    "localId": "b98fd448-6510-4537-bb63-1eb647a5d42f"
                },
                "type": "DegreeProgramme",
                "groupId": "hy-DP-114256325",
                "gradeScaleId": "sis-hyl-hyv",
                "targetCredits": {
                    "max": 200,
                    "min": 180
                }
            }
        }`);
  }

  isValidInput(input) {
    /*Accepts numbers letters underscores and dashes*/
    //var pattern = /^[\p{L}0-9_-]+( [\p{L}0-9_-]+)*$/u;

    // This regex accepts numbers, letters (including Unicode letters), dashes, colons, underscores,
    // commas, and allows spaces between words.
    var pattern = /^[\p{L}0-9-:,_]+( [\p{L}0-9-:,_]+)*$/u;

    return pattern.test(input);
  }

  async getlvNames() {
    /*
        Gets list of "lv_names" Academic year codes.

        Returns the list of lv_names in JSON format.
        */
    return JSON.parse(`{
            "hy-lv-1": "1950-51",
            "hy-lv-2": "1951-52",
            "hy-lv-3": "1952-53",
            "hy-lv-4": "1953-54",
            "hy-lv-5": "1954-55",
            "hy-lv-6": "1955-56",
            "hy-lv-7": "1956-57",
            "hy-lv-8": "1957-58",
            "hy-lv-9": "1958-59",
            "hy-lv-10": "1959-60",
            "hy-lv-11": "1960-61",
            "hy-lv-12": "1961-62",
            "hy-lv-13": "1962-63",
            "hy-lv-14": "1963-64",
            "hy-lv-15": "1964-65",
            "hy-lv-16": "1965-66",
            "hy-lv-17": "1966-67",
            "hy-lv-18": "1967-68",
            "hy-lv-19": "1968-69",
            "hy-lv-20": "1969-70",
            "hy-lv-21": "1970-71",
            "hy-lv-22": "1971-72",
            "hy-lv-23": "1972-73",
            "hy-lv-24": "1973-74",
            "hy-lv-25": "1974-75",
            "hy-lv-26": "1975-76",
            "hy-lv-27": "1976-77",
            "hy-lv-28": "1977-78",
            "hy-lv-29": "1978-79",
            "hy-lv-30": "1979-80",
            "hy-lv-31": "1980-81",
            "hy-lv-32": "1981-82",
            "hy-lv-33": "1982-83",
            "hy-lv-34": "1983-84",
            "hy-lv-35": "1984-85",
            "hy-lv-36": "1985-86",
            "hy-lv-37": "1986-87",
            "hy-lv-38": "1987-88",
            "hy-lv-39": "1988-89",
            "hy-lv-40": "1989-90",
            "hy-lv-41": "1990-91",
            "hy-lv-42": "1991-92",
            "hy-lv-43": "1992-93",
            "hy-lv-44": "1993-94",
            "hy-lv-45": "1994-95",
            "hy-lv-46": "1995-96",
            "hy-lv-47": "1996-97",
            "hy-lv-48": "1997-98",
            "hy-lv-49": "1998-99",
            "hy-lv-50": "1999-00",
            "hy-lv-51": "2000-01",
            "hy-lv-52": "2001-02",
            "hy-lv-53": "2002-03",
            "hy-lv-54": "2003-04",
            "hy-lv-55": "2004-05",
            "hy-lv-56": "2005-06",
            "hy-lv-57": "2006-07",
            "hy-lv-58": "2007-08",
            "hy-lv-59": "2008-09",
            "hy-lv-60": "2009-10",
            "hy-lv-61": "2010-11",
            "hy-lv-62": "2011-12",
            "hy-lv-63": "2012-13",
            "hy-lv-64": "2013-14",
            "hy-lv-65": "2014-15",
            "hy-lv-66": "2015-16",
            "hy-lv-67": "2016-17",
            "hy-lv-68": "2017-18",
            "hy-lv-69": "2018-19",
            "hy-lv-70": "2019-20",
            "hy-lv-71": "2020-21",
            "hy-lv-72": "2021-22",
            "hy-lv-73": "2022-23",
            "hy-lv-74": "2023-24",
            "hy-lv-75": "2024-25",
            "hy-lv-76": "2025-26",
            "hy-lv-77": "2026-27",
            "hy-lv-78": "2027-28"
        }`);
  }

  async degreeStructure(id, lvName = "hy-lv-74") {
    /*
        Gets the degree structure using <id> which should be the degree code.
        Shows the <period> specific structure.

        Returns the selected periods degree stucture in JSON format.
        */
    if (this.isValidInput(id) && this.isValidInput(lvName)) {
      if (
        id.toUpperCase() === "KH50_005" &&
        lvName.toLowerCase() === "hy-lv-74"
      ) {
        return this.degree;
      }
      return "";
    } else {
      return "Virheellinen syöte";
    }
  }
}

module.exports = HelsinkiInterface;
