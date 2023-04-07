async function subtractVacationDays(UserVacation, userId, vacationTypeId, numDays) {
  try {
    const userVacation = await UserVacation.findOne({
      where: { user_id: userId, vacation_type_id: vacationTypeId }
    });
    if (userVacation) {
      userVacation.remaining_days -= numDays;
      userVacation.total_days -= numDays;
      await userVacation.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
