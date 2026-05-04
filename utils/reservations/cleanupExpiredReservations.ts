export const cleanupExpiredReservations = async (
  refetchReservations: () => Promise<void>,
  showMsg: (msg: string) => void
) => {
  try {
    const res = await fetch("/api/reservations/cleanup", {
      method: "DELETE",
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();

    if (data.success && data.pastCount > 0) {
      showMsg("Past reservations were moved to your reservation history.");
      await refetchReservations();
    } else {
      await refetchReservations();
    }
  } catch {
    return;
  }
};
