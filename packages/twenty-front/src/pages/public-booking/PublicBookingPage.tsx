import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

// Types for the meeting schema returned by the API
type MeetingTypeSchema = {
  id: string;
  name: string;
  durationMinutes: number;
  description: string | null;
  confirmationMessage: string | null;
};

type TimeSlot = {
  startTime: string;
  endTime: string;
};

type BookingState = 'loading' | 'ready' | 'submitting' | 'success' | 'error';

// Styled components

const StyledPageContainer = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.noisy};
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: ${themeCssVariables.spacing[8]} ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.light};
  max-width: 600px;
  padding: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledMeetingName = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledDuration = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin: 0;
`;

const StyledDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  margin: 0;
`;

const StyledSectionLabel = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

const StyledCalendarContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledCalendarNav = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledCalendarNavButton = styled.button`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  transition: background 150ms ease;

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const StyledMonthLabel = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledCalendarGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[1]};
  grid-template-columns: repeat(7, 1fr);
`;

const StyledWeekdayHeader = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} 0;
  text-align: center;
`;

const StyledDayCell = styled.button<{
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}>`
  aspect-ratio: 1;
  background: ${({ isSelected }) =>
    isSelected ? themeCssVariables.color.blue : 'transparent'};
  border: 1px solid
    ${({ isToday, isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : isToday
          ? themeCssVariables.border.color.strong
          : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isSelected, isDisabled }) =>
    isSelected
      ? themeCssVariables.font.color.inverted
      : isDisabled
        ? themeCssVariables.font.color.extraLight
        : themeCssVariables.font.color.primary};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  font-size: ${themeCssVariables.font.size.sm};
  padding: 0;
  transition: background 150ms ease;

  &:hover {
    background: ${({ isSelected, isDisabled }) =>
      isSelected
        ? themeCssVariables.color.blue
        : isDisabled
          ? 'transparent'
          : themeCssVariables.background.tertiary};
  }
`;

// Empty cell for padding days at the start of the month
const StyledEmptyCell = styled.div`
  aspect-ratio: 1;
`;

const StyledSlotsContainer = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledSlotButton = styled.button<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.color.blue
      : themeCssVariables.background.secondary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.inverted
      : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition:
    background 150ms ease,
    border-color 150ms ease;

  &:hover {
    background: ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : themeCssVariables.background.tertiary};
  }
`;

const StyledSlotsLoading = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin-bottom: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

const StyledNoSlots = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin-bottom: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: border-color 150ms ease;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledTextArea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  min-height: 80px;
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
  transition: border-color 150ms ease;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledSubmitButton = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: opacity 150ms ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSuccessMessage = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]} 0;
  text-align: center;
`;

const StyledSuccessTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledSuccessText = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

const StyledBookedTime = styled.p`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  margin: 0;
`;

const StyledErrorMessage = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]} 0;
  text-align: center;
`;

const StyledErrorTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledErrorText = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

const StyledLoadingMessage = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]} 0;
  text-align: center;
`;

const StyledLoadingText = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin: 0;
`;

const StyledInlineError = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

// Calendar utility helpers

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatDateToIso = (year: number, month: number, day: number): string => {
  const monthString = String(month + 1).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return `${year}-${monthString}-${dayString}`;
};

const formatTimeForDisplay = (isoTime: string): string => {
  const date = new Date(isoTime);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatBookedTimeForDisplay = (isoTime: string): string => {
  const date = new Date(isoTime);

  return date.toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isSameDay = (
  year1: number,
  month1: number,
  day1: number,
  year2: number,
  month2: number,
  day2: number,
): boolean => {
  return year1 === year2 && month1 === month2 && day1 === day2;
};

const isBeforeToday = (
  year: number,
  month: number,
  day: number,
  today: Date,
): boolean => {
  const cellDate = new Date(year, month, day);

  cellDate.setHours(0, 0, 0, 0);

  const todayStart = new Date(today);

  todayStart.setHours(0, 0, 0, 0);

  return cellDate < todayStart;
};

// Main component

export const PublicBookingPage = () => {
  const { workspaceId, meetingTypeId } = useParams<{
    workspaceId: string;
    meetingTypeId: string;
  }>();

  // Core state
  const [bookingState, setBookingState] = useState<BookingState>('loading');
  const [meetingTypeSchema, setMeetingTypeSchema] =
    useState<MeetingTypeSchema | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calendar state
  const today = useMemo(() => new Date(), []);
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Slots state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Guest form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

  // Success state
  const [bookedStartTime, setBookedStartTime] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );

  // Fetch the meeting type schema on mount
  useEffect(() => {
    const fetchMeetingTypeSchema = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/meetings/${workspaceId}/${meetingTypeId}/schema`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ?? `Meeting type not found (${response.status})`,
          );
        }

        const data: MeetingTypeSchema = await response.json();

        setMeetingTypeSchema(data);
        setBookingState('ready');
      } catch (fetchError) {
        setErrorMessage(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load meeting type',
        );
        setBookingState('error');
      }
    };

    if (isDefined(workspaceId) && isDefined(meetingTypeId)) {
      fetchMeetingTypeSchema();
    }
  }, [workspaceId, meetingTypeId]);

  // Fetch available slots when a date is selected
  useEffect(() => {
    if (!isDefined(selectedDate)) {
      setAvailableSlots([]);

      return;
    }

    const fetchSlots = async () => {
      setIsSlotsLoading(true);
      setSelectedSlot(null);
      setAvailableSlots([]);

      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/meetings/${workspaceId}/${meetingTypeId}/slots?date=${selectedDate}`,
        );

        if (!response.ok) {
          throw new Error('Failed to load available times');
        }

        const data = await response.json();

        setAvailableSlots(data.slots ?? []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setIsSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, workspaceId, meetingTypeId]);

  // Calendar navigation
  const navigateToPreviousMonth = useCallback(() => {
    setDisplayMonth((previousMonth) => {
      if (previousMonth === 0) {
        setDisplayYear((previousYear) => previousYear - 1);

        return 11;
      }

      return previousMonth - 1;
    });
  }, []);

  const navigateToNextMonth = useCallback(() => {
    setDisplayMonth((previousMonth) => {
      if (previousMonth === 11) {
        setDisplayYear((previousYear) => previousYear + 1);

        return 0;
      }

      return previousMonth + 1;
    });
  }, []);

  // Whether navigating to the previous month is allowed
  // (cannot go before the current month)
  const isPreviousMonthDisabled = useMemo(() => {
    return (
      displayYear < today.getFullYear() ||
      (displayYear === today.getFullYear() && displayMonth <= today.getMonth())
    );
  }, [displayYear, displayMonth, today]);

  // Handle day click
  const handleDayClick = useCallback(
    (day: number) => {
      const dateString = formatDateToIso(displayYear, displayMonth, day);

      setSelectedDate(dateString);
    },
    [displayYear, displayMonth],
  );

  // Handle slot click
  const handleSlotClick = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
  }, []);

  // Submit booking
  const handleSubmit = useCallback(async () => {
    if (!isDefined(selectedSlot) || bookingState !== 'ready') {
      return;
    }

    if (guestName.trim().length === 0 || guestEmail.trim().length === 0) {
      return;
    }

    setBookingState('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/meetings/${workspaceId}/${meetingTypeId}/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: guestName.trim(),
            guestEmail: guestEmail.trim(),
            guestNotes: guestNotes.trim(),
            startTime: selectedSlot.startTime,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? 'Booking failed');
      }

      const data = await response.json();

      setBookedStartTime(selectedSlot.startTime);
      setConfirmationMessage(
        data.meetingType?.confirmationMessage ??
          meetingTypeSchema?.confirmationMessage ??
          'Your meeting has been booked.',
      );
      setBookingState('success');
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to book meeting',
      );
      setBookingState('ready');
    }
  }, [
    selectedSlot,
    bookingState,
    guestName,
    guestEmail,
    guestNotes,
    workspaceId,
    meetingTypeId,
    meetingTypeSchema,
  ]);

  // Build the calendar grid data
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDayOfWeek = getFirstDayOfWeek(displayYear, displayMonth);
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // Parse the selected date for comparison
    let selectedYear = -1;
    let selectedMonth = -1;
    let selectedDay = -1;

    if (isDefined(selectedDate)) {
      const parts = selectedDate.split('-');

      selectedYear = parseInt(parts[0], 10);
      selectedMonth = parseInt(parts[1], 10) - 1;
      selectedDay = parseInt(parts[2], 10);
    }

    // Build leading empty cells
    const emptyCells: Array<{ type: 'empty'; key: string }> = [];

    for (let emptyIndex = 0; emptyIndex < firstDayOfWeek; emptyIndex++) {
      emptyCells.push({ type: 'empty', key: `empty-${emptyIndex}` });
    }

    // Build day cells
    const dayCells: Array<{
      type: 'day';
      key: string;
      day: number;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
    }> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dayCells.push({
        type: 'day',
        key: `day-${day}`,
        day,
        isToday: isSameDay(
          displayYear,
          displayMonth,
          day,
          todayYear,
          todayMonth,
          todayDay,
        ),
        isSelected: isSameDay(
          displayYear,
          displayMonth,
          day,
          selectedYear,
          selectedMonth,
          selectedDay,
        ),
        isDisabled: isBeforeToday(displayYear, displayMonth, day, today),
      });
    }

    return { emptyCells, dayCells };
  }, [displayYear, displayMonth, today, selectedDate]);

  // Whether the submit button should be disabled
  const isSubmitDisabled = useMemo(() => {
    return (
      bookingState === 'submitting' ||
      !isDefined(selectedSlot) ||
      guestName.trim().length === 0 ||
      guestEmail.trim().length === 0
    );
  }, [bookingState, selectedSlot, guestName, guestEmail]);

  // Loading state
  if (bookingState === 'loading') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledLoadingMessage>
            <StyledLoadingText>Loading booking page...</StyledLoadingText>
          </StyledLoadingMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // Fatal error state (schema could not be loaded)
  if (bookingState === 'error' && !isDefined(meetingTypeSchema)) {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledErrorMessage>
            <StyledErrorTitle>Booking Unavailable</StyledErrorTitle>
            <StyledErrorText>
              {errorMessage ?? 'This booking page is not available.'}
            </StyledErrorText>
          </StyledErrorMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // Success state
  if (bookingState === 'success') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledSuccessMessage>
            <StyledSuccessTitle>Meeting Booked</StyledSuccessTitle>
            <StyledSuccessText>
              {confirmationMessage ?? 'Your meeting has been booked.'}
            </StyledSuccessText>
            {isDefined(bookedStartTime) && (
              <StyledBookedTime>
                {formatBookedTimeForDisplay(bookedStartTime)}
              </StyledBookedTime>
            )}
          </StyledSuccessMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // Schema not loaded (should not happen, but guard)
  if (!isDefined(meetingTypeSchema)) {
    return null;
  }

  // Ready state — show the booking form
  return (
    <StyledPageContainer>
      <StyledCard>
        {/* Header — meeting name and duration */}
        <StyledHeader>
          <StyledMeetingName>{meetingTypeSchema.name}</StyledMeetingName>
          <StyledDuration>
            {meetingTypeSchema.durationMinutes} minutes
          </StyledDuration>
          {isDefined(meetingTypeSchema.description) &&
            meetingTypeSchema.description.length > 0 && (
              <StyledDescription>
                {meetingTypeSchema.description}
              </StyledDescription>
            )}
        </StyledHeader>

        {/* Calendar — select a date */}
        <StyledCalendarContainer>
          <StyledSectionLabel>Select a Date</StyledSectionLabel>

          <StyledCalendarNav>
            <StyledCalendarNavButton
              onClick={navigateToPreviousMonth}
              disabled={isPreviousMonthDisabled}
            >
              &larr;
            </StyledCalendarNavButton>
            <StyledMonthLabel>
              {MONTH_NAMES[displayMonth]} {displayYear}
            </StyledMonthLabel>
            <StyledCalendarNavButton onClick={navigateToNextMonth}>
              &rarr;
            </StyledCalendarNavButton>
          </StyledCalendarNav>

          <StyledCalendarGrid>
            {WEEKDAY_LABELS.map((weekday) => (
              <StyledWeekdayHeader key={weekday}>{weekday}</StyledWeekdayHeader>
            ))}

            {calendarDays.emptyCells.map((cell) => (
              <StyledEmptyCell key={cell.key} />
            ))}

            {calendarDays.dayCells.map((cell) => (
              <StyledDayCell
                key={cell.key}
                isToday={cell.isToday}
                isSelected={cell.isSelected}
                isDisabled={cell.isDisabled}
                disabled={cell.isDisabled}
                onClick={() => handleDayClick(cell.day)}
              >
                {cell.day}
              </StyledDayCell>
            ))}
          </StyledCalendarGrid>
        </StyledCalendarContainer>

        {/* Time slots — shown after a date is selected */}
        {isDefined(selectedDate) && (
          <>
            <StyledSectionLabel>Select a Time</StyledSectionLabel>

            {isSlotsLoading && (
              <StyledSlotsLoading>
                Loading available times...
              </StyledSlotsLoading>
            )}

            {!isSlotsLoading && availableSlots.length === 0 && (
              <StyledNoSlots>No available times for this date.</StyledNoSlots>
            )}

            {!isSlotsLoading && availableSlots.length > 0 && (
              <StyledSlotsContainer>
                {availableSlots.map((slot) => (
                  <StyledSlotButton
                    key={slot.startTime}
                    isSelected={selectedSlot?.startTime === slot.startTime}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {formatTimeForDisplay(slot.startTime)}
                  </StyledSlotButton>
                ))}
              </StyledSlotsContainer>
            )}
          </>
        )}

        {/* Guest info form — shown after a slot is selected */}
        {isDefined(selectedSlot) && (
          <>
            <StyledSectionLabel>Your Details</StyledSectionLabel>

            <StyledFormGroup>
              <StyledLabel htmlFor="booking-guest-name">Name *</StyledLabel>
              <StyledInput
                id="booking-guest-name"
                type="text"
                placeholder="Your full name"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="booking-guest-email">Email *</StyledLabel>
              <StyledInput
                id="booking-guest-email"
                type="email"
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="booking-guest-notes">Notes</StyledLabel>
              <StyledTextArea
                id="booking-guest-notes"
                placeholder="Anything you'd like us to know (optional)"
                value={guestNotes}
                onChange={(event) => setGuestNotes(event.target.value)}
              />
            </StyledFormGroup>

            {isDefined(errorMessage) && (
              <StyledInlineError>{errorMessage}</StyledInlineError>
            )}

            <StyledSubmitButton
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {bookingState === 'submitting' ? 'Booking...' : 'Confirm Booking'}
            </StyledSubmitButton>
          </>
        )}
      </StyledCard>
    </StyledPageContainer>
  );
};
