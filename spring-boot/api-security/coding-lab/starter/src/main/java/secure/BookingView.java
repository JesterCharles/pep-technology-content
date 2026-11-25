package secure;

/** What a customer may see of a booking. This record is complete; you do not edit it. */
public record BookingView(Long id, String workshop, int seats) {

    static BookingView from(Booking booking) {
        return new BookingView(booking.getId(), booking.getWorkshop(), booking.getSeats());
    }
}
