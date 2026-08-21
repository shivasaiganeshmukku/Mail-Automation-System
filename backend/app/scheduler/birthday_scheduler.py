from apscheduler.schedulers.background import BackgroundScheduler

from app.services.birthday_service import BirthdayService


scheduler = BackgroundScheduler()


def run_daily_birthday_process(app):

    print("=" * 60)
    print("Starting automatic birthday process")
    print("=" * 60)

    with app.app_context():

        try:

            result = BirthdayService.process_birthdays()

            print("Automatic birthday process completed.")
            print("Result:", result)

        except Exception as e:

            print("Automatic birthday process failed.")
            print("Error:", str(e))


def start_scheduler(app):

    if scheduler.running:
        return

    scheduler.add_job(
        func=run_daily_birthday_process,
        args=[app],
        trigger="cron",
        hour=9,
        minute=0,
        id="daily_birthday_job",
        replace_existing=True
    )

    scheduler.start()

    print("=" * 60)
    print("Birthday scheduler started.")
    print("Daily birthday check: 09:00 AM")
    print("=" * 60)