using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MessageMeAPI.Helpers
{
    public class Consts
    {
        // When published to Heroku I need to make some changes (in time zones for example) to do this, we simply create a const which I check wether or not API is running in development enviroment
        public static bool DEBUG_MODE = Dns.GetHostName() == "DESKTOP-KUA5OEQ";
    }
}
