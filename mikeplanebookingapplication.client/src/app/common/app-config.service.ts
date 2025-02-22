export class AppConfigService {




  public readonly END_POINTS = {
    PRODUCTION: {
      MAIN_API: "",
      TEST_API: ""
    },
    LOCALHOST: {
      MAIN_API: "http://localhost:5101" //local server
    }
  }

  /**
  * This property checks if app is in production mode.
  */
    public readonly IS_PRODUCTION: boolean = false;

    public readonly IS_TEST: boolean = true;
}

interface END_POINTS {
  PRODUCTION: {
    MAIN_API: string;
    TEST_API: string;
  };
  LOCALHOST: {
    MAIN_API: string;
  };
}
