export const cleanupExpiredReservations = async (
  refetchReservations: () => Promise<void>,
  showMsg: (msg: string) => void
) => {
  //console.log("______CLEANUP START______");

  try {
    const res = await fetch("/api/auth/reservations/cleanup", {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Cleanup API error:", res.status);
      return;
    }

    const data = await res.json();
    //console.log("Cleanup response:", data);

    if (data.success && data.deletedCount > 0) {
      //console.log(`Setting expired message: ${data.deletedCount} reservation has been deleted because it has expired.`);

      // first render msg, after refetch
      showMsg("Your reservation has been deleted because it has expired.");

      setTimeout(async () => {
        //console.log("___Refetching reservations___");
        await refetchReservations();
        //console.log("___Refetch done___");
      }, 500);
    } else {
      console.log("No expired to delete");
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    //console.log("___CLEANUP END___");
  }
};