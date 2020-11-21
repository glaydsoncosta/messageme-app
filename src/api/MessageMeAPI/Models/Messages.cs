using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageMeAPI.Models
{
    [Table("messages")]
    public class Messages
    {
        [ExplicitKey]
        public long id { get; set; }
        public long user_id { get; set; }
        public DateTime timestamp { get; set; }
        public DateTime? read_at { get; set; }
        public bool read { get; set; }
        public string subject { get; set; }
        public string detail { get; set; }
        [Computed]
        public Users user { get; set; }
    }
}
