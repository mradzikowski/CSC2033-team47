from flask.cli import FlaskGroup
from src import create_app, db
from src.api.models import Category, Dataset, User

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command("recreate_db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    db.session.add(User(username="Mateusz", email="mateusz@email.com"))
    db.session.add(User(username="Toby", email="toby@email.com"))
    db.session.add(User(username="Mellisa", email="melissa@email.com"))
    db.session.add(User(username="Joseph", email="joseph@email.com"))
    db.session.add(User(username="Chloe", email="chloe@email.com"))

    db.session.add(Category(category_name="carbon-emission"))
    db.session.add(Category(category_name="sustainability"))
    db.session.add(Category(category_name="extinction"))
    db.session.add(Category(category_name="greenhouse-gas-emission"))
    db.session.add(Category(category_name="global-warming"))

    db.session.add(
        Dataset(
            user_id=1,
            file_name="carbon-emission-world.csv",
            title="Carbon-emission in the world",
            category="carbon-emission",
        ),
    )
    db.session.add(
        Dataset(
            user_id=1,
            file_name="carbon-emission-uk.csv",
            title="Carbon-emission in the UK",
            category="carbon-emission",
        ),
    )
    db.session.add(
        Dataset(
            user_id=2,
            file_name="sustainability-world.csv",
            title="Sustainability in the world",
            category="sustainability",
        ),
    )
    db.session.add(
        Dataset(
            user_id=2,
            file_name="sustainability-uk.csv",
            title="Sustainability in the UK",
            category="sustainability",
        ),
    )
    db.session.add(
        Dataset(
            user_id=3,
            file_name="extinction-world.csv",
            title="Extinction in the world",
            category="extinction",
        ),
    )
    db.session.add(
        Dataset(
            user_id=3,
            file_name="extinction-uk.csv",
            title="Extinction in the UK",
            category="extinction",
        ),
    )
    db.session.add(
        Dataset(
            user_id=4,
            file_name="greenhouse-gas-emission-world.csv",
            title="Greenhouse-gas-emission in the world",
            category="greenhouse-gas-emission",
        ),
    )
    db.session.add(
        Dataset(
            user_id=4,
            file_name="greenhouse-gas-emission-uk.csv",
            title="Greenhouse-gas-emission in the UK",
            category="greenhouse-gas-emission",
        ),
    )
    db.session.add(
        Dataset(
            user_id=4,
            file_name="global-warming-world.csv",
            title="global-warming in the World",
            category="global-warming",
        ),
    )
    db.session.add(
        Dataset(
            user_id=5,
            file_name="global-warming-uk.csv",
            title="global-warming in the UK",
            category="global-warming",
        ),
    )

    db.session.commit()


if __name__ == "__main__":
    cli()
