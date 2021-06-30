using Mafmax.RollingRetention.App.Context.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Services
{
    public interface IRetentionsService
    {
        IEnumerable<UserRetentionDto> GetUsersRetention();
        void SaveUserRetention(IEnumerable<UserRetentionDto> users);
    }
}
