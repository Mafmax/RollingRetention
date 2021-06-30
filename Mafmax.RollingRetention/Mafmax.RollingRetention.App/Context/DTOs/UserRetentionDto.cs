using Mafmax.RollingRetention.App.Context.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Context.DTOs
{
    public class UserRetentionDto
    {
        public int Id { get; set; }
        public DateTime RegistrationDate{ get; set; }
        public DateTime LastActivityDate { get; set; }
        public UserRetentionDto()
        {

        }
        public UserRetentionDto(UserEntity user)
        {
            Id = user.Id;
            RegistrationDate = user.RegistrationDate;
            LastActivityDate = user.LastActivityDate;
        }   

        public UserEntity GetUser()
        {
            return new UserEntity { Id = Id, LastActivityDate = LastActivityDate, RegistrationDate = RegistrationDate };
        }
    }
}
